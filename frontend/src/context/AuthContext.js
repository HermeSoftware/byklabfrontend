import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('byklab_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('byklab_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('byklab_user');
  };

  const updateSubscription = (planName) => {
    const updatedUser = { ...user, subscription_plan: planName };
    setUser(updatedUser);
    localStorage.setItem('byklab_user', JSON.stringify(updatedUser));
  };

  const hasAccess = (feature) => {
    if (!user) return false;
    
    const plan = user.subscription_plan || 'Ücretsiz';
    
    switch (feature) {
      case 'blog':
      case 'about':
        return true;
      case 'anatomy':
      case 'dashboard':
        return ['Temel', 'Gelişmiş', 'Kapsamlı'].includes(plan);
      case 'video-swipe':
        return ['Gelişmiş', 'Kapsamlı'].includes(plan);
      case 'ai-features':
        return plan === 'Kapsamlı';
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateSubscription, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};