import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/** Normalize backend user so both user.name and user.fullName work */
const normalize = (u) => u ? { ...u, name: u.fullName || u.name || u.username } : null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    authApi.session()
      .then((data) => setUser(normalize(data.user)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(normalize(data.user));
  };

  const signup = async (username, fullName, email, password, role = 'STUDENT') => {
    const data = await authApi.signup(username, fullName, email, password, role);
    setUser(normalize(data.user));
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
  };

  const refreshUser = async () => {
    const data = await authApi.session();
    setUser(normalize(data.user));
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
