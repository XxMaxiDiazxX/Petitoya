// auth-context.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Recuperar la información de la sesión desde localStorage al cargar la página
    const storedUser = localStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser && storedIsLoggedIn) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);

  
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));

  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);

    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};