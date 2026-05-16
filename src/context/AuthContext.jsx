import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const buildMockUser = (role = 'TEACHER', overrides = {}) => {
  const normalized = (role || 'TEACHER').toUpperCase();
  const isTeacher = normalized === 'TEACHER';
  return {
    id: isTeacher ? 'demo-teacher' : 'demo-student',
    username: isTeacher ? 'demo.teacher' : 'demo.student',
    fullName: isTeacher ? 'Dr. Demo Teacher' : 'Demo Student',
    name: isTeacher ? 'Dr. Demo Teacher' : 'Demo Student',
    email: isTeacher ? 'teacher@examhub.local' : 'student@examhub.local',
    role: normalized,
    ...overrides,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => buildMockUser('TEACHER'));

  const login = (email, _password, role = 'TEACHER') => {
    setUser(buildMockUser(role, email ? { email } : {}));
  };

  const signup = (username, email, _password, fullName, role = 'STUDENT') => {
    setUser(
      buildMockUser(role, {
        username: username || undefined,
        email: email || undefined,
        fullName: fullName || undefined,
        name: fullName || undefined,
      }),
    );
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isLoading: false,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
