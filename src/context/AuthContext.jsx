import { createContext, useContext, useState, useEffect } from 'react';

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
    const savedUser = localStorage.getItem('examhub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('examhub_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = (email, password, role = 'student') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          name: role === 'teacher' ? 'Dr. Sarah Johnson' : 'Alex Thompson',
          role: role, // 'teacher' or 'student'
          avatar: null,
          department: role === 'teacher' ? 'Computer Science' : null,
          studentId: role === 'student' ? 'STU-2024-001' : null,
          joinedDate: 'January 15, 2024',
        };
        setUser(mockUser);
        localStorage.setItem('examhub_user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  // Mock signup function
  const signup = (name, email, password, role = 'student') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          name: name,
          role: role,
          avatar: null,
          department: role === 'teacher' ? 'Computer Science' : null,
          studentId: role === 'student' ? `STU-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}` : null,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        setUser(mockUser);
        localStorage.setItem('examhub_user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('examhub_user');
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
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    login,
    signup,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
