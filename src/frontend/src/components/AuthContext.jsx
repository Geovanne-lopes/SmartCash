import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userSession");

    if (storedData) {
      const { user, expiresAt } = JSON.parse(storedData);
      const now = new Date().getTime();

      if (now > expiresAt) {
        localStorage.removeItem("userSession");
        setUser(null);
      } else {
        setUser(user);

        const timeout = setTimeout(() => {
          localStorage.removeItem("userSession");
          setUser(null);
          window.location.href = "/login";
        }, expiresAt - now);

        return () => clearTimeout(timeout);
      }
    }
  }, []);

  const login = (userData) => {
    const expiresAt = new Date().getTime() + 3 * 60 * 1000; // 3 minutos
    const sessionData = { user: userData, expiresAt };

    localStorage.setItem("userSession", JSON.stringify(sessionData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userSession");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
