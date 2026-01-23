import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser } from '../services/authService';

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

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('examhub_user');
      if (savedUser) {
        try {
          // Try to validate the session with the backend
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('examhub_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Session validation failed:', error);
          localStorage.removeItem('examhub_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // Login function with real API call
  const login = async (username, password) => {
    try {
      const userData = await apiLogin(username, password);
      setUser(userData);
      localStorage.setItem('examhub_user', JSON.stringify(userData));
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

  // Switch role (for demo purposes)
  const switchRole = () => {
    if (!user) return;
    
    const newRole = user.role === 'teacher' ? 'student' : 'teacher';
    const updatedUser = {
      ...user,
      role: newRole,
      name: newRole === 'teacher' ? 'Dr. Sarah Johnson' : 'Alex Thompson',
      department: newRole === 'teacher' ? 'Computer Science' : null,
      studentId: newRole === 'student' ? 'STU-2024-001' : null,
    };
    
    setUser(updatedUser);
    localStorage.setItem('examhub_user', JSON.stringify(updatedUser));
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
