import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const sessionTimeout = 10 * 60 * 1000; // Tiempo de sesión en milisegundos (24 horas)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedSessionStartTime = localStorage.getItem("sessionStartTime");

    if (
      storedUser &&
      storedRole &&
      storedIsLoggedIn &&
      storedSessionStartTime
    ) {
      const startTime = new Date(JSON.parse(storedSessionStartTime));
      const currentTime = new Date();

      if (currentTime - startTime < sessionTimeout) {
        setUser(JSON.parse(storedUser));
        setRole(JSON.parse(storedRole));
        setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        setSessionStartTime(startTime);
      } else {
        logout(); // Cierra la sesión si el tiempo ha expirado
      }
    }
  }, []);

  const login = (userData) => {
    try {
      if (userData && userData.user && userData.role) {
        const currentTime = new Date();

        setUser(userData.user);
        setRole(userData.role);
        setIsLoggedIn(true);
        setSessionStartTime(currentTime);

        localStorage.setItem("user", JSON.stringify(userData.user));
        localStorage.setItem("role", JSON.stringify(userData.role));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("sessionStartTime", JSON.stringify(currentTime));
      } else {
        console.error("Datos de usuario inválidos para el login.");
      }
    } catch (error) {
      console.error("Error al realizar el login:", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setRole(null);
      setIsLoggedIn(false);
      setSessionStartTime(null);

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("sessionStartTime");
    } catch (error) {
      console.error("Error al realizar el logout:", error);
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const startTime = new Date(JSON.parse(localStorage.getItem('sessionStartTime')));
      const currentTime = new Date();

      if (currentTime - startTime >= sessionTimeout) {
        logout(); // Cierra la sesión si el tiempo ha expirado
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reiniciar el tiempo de sesión cuando la página se vuelve visible
        const currentTime = new Date();
        setSessionStartTime(currentTime);
        localStorage.setItem("sessionStartTime", JSON.stringify(currentTime));
      }
    };

    // Configurar eventos para detectar cuando la página se vuelve visible y asi reiniciar contador
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(checkSession, 60000); // Verificar cada minuto

    return () => {
      clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
