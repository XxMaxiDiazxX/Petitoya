// auth-context.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Recuperar la información de la sesión desde localStorage al cargar la página
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (storedUser && storedIsAdmin && storedIsLoggedIn) {
      setUser(JSON.parse(storedUser));
      setIsAdmin(JSON.parse(storedIsAdmin));
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);
  
const login = (userData) => {
    setUser(userData.user);
    setIsAdmin(userData.isAdmin);
    setIsLoggedIn(true);

    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('isAdmin', JSON.stringify(userData.isAdmin));
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
};

const logout = () => {
  setUser(null);
  setIsAdmin(false);
  setIsLoggedIn(false);

  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('isLoggedIn');
};

return (
  <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout }}>
    {children}
  </AuthContext.Provider>
);
};
export const useAuth = () => {
  return useContext(AuthContext);
};
