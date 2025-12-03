import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // For demo purposes - replace with actual API call
      // const response = await fetch('http://localhost:5000/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      // Demo login - accepts any email/password
      const demoUser = {
        id: '1',
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        role: 'admin',
        avatar: email.charAt(0).toUpperCase() + email.split('@')[0].charAt(1).toUpperCase(),
        department: 'Management',
        position: 'Administrator',
        joinDate: new Date().toISOString().split('T')[0]
      };

      const demoToken = 'demo_token_' + Date.now();

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);

      setUser(demoUser);
      setIsAuthenticated(true);

      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Update settings
  const updateSettings = (settings) => {
    const currentSettings = JSON.parse(localStorage.getItem('settings') || '{}');
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem('settings', JSON.stringify(newSettings));
    return { success: true, settings: newSettings };
  };

  // Get settings
  const getSettings = () => {
    return JSON.parse(localStorage.getItem('settings') || '{}');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    updateSettings,
    getSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};