import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser, switchRole as apiSwitchRole } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session refresh function - attempt to re-establish session with current user data
  const refreshSession = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      localStorage.setItem('examhub_user', JSON.stringify(userData));
      console.log('Session refreshed successfully');
      return true;
    } catch (error) {
      console.log('Session refresh failed:', error.message);
      return false;
    }
  };

  // Listen for session expiration events from API
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('Session expired, logging out user');
      setUser(null);
      localStorage.removeItem('examhub_user');
    };

    const handleSessionRefreshNeeded = async () => {
      console.log('Session refresh needed, attempting to refresh...');
      const success = await refreshSession();
      if (!success) {
        console.log('Session refresh failed, keeping user logged in with localStorage data');
        // Don't log out the user, just log the failure
      }
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    window.addEventListener('auth:session-refresh-needed', handleSessionRefreshNeeded);
    
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      window.removeEventListener('auth:session-refresh-needed', handleSessionRefreshNeeded);
    };
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // First, immediately load user from localStorage if available
      const savedUser = localStorage.getItem('examhub_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('Loaded user from localStorage:', parsedUser.username);
        } catch (parseError) {
          console.error('Failed to parse saved user data:', parseError);
          localStorage.removeItem('examhub_user');
        }
      }

      // Then validate session in background
      try {
        const userData = await getCurrentUser();
        console.log('Session validation successful');
        setUser(userData);
        localStorage.setItem('examhub_user', JSON.stringify(userData));
      } catch (error) {
        console.log('Session validation failed:', error.message);
        
        // If we don't have a saved user, set user to null
        if (!savedUser) {
          setUser(null);
        }
        // If we have saved user data, keep the user logged in
        // The session will be re-established on the next API call
      }
      
      // Add a small delay to ensure component tree is fully rendered
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };
    
    checkSession();
  }, []);

  // Login function with real API call
  const login = async (email, password) => {
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('examhub_user', JSON.stringify(userData));
      console.log('Login successful:', userData.username);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Signup function with real API call
  const signup = async (username, email, password, fullName, role) => {
    try {
      const userData = await apiSignup({
        username,
        email,
        password,
        fullName,
        role: role.toUpperCase(), // Convert to TEACHER or STUDENT
      });
      setUser(userData);
      localStorage.setItem('examhub_user', JSON.stringify(userData));
      console.log('Signup successful:', userData.username);
      return userData;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  // Logout function with real API call
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('examhub_user');
    }
  };

  // Switch role using backend API
  const switchRole = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await apiSwitchRole();
      setUser(updatedUser);
      localStorage.setItem('examhub_user', JSON.stringify(updatedUser));
      console.log('Role switched successfully:', updatedUser.username, 'is now', updatedUser.role);
    } catch (error) {
      console.error('Role switch failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER' || user?.role === 'teacher',
    isStudent: user?.role === 'STUDENT' || user?.role === 'student',
    login,
    signup,
    logout,
    switchRole,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
