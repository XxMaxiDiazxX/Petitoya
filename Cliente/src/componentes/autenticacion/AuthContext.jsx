import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Recuperar la información de la sesión desde localStorage al cargar la página
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
  
    if (storedUser && storedRole && storedIsLoggedIn) {
      setUser(JSON.parse(storedUser));
      setRole(JSON.parse(storedRole));
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    } else {
      console.error('Alguno de los valores recuperados del localStorage está indefinido.');
    }
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    setRole(userData.role);
    setIsLoggedIn(true);

    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('role', JSON.stringify(userData.role));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsLoggedIn(false);

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
