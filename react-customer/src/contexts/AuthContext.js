import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Optional: Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          setUser(null);
          localStorage.removeItem('token');
        } else {
          setUser(decoded);
        }
      } catch (e) {
        setUser(null);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = React.useMemo(() => ({ user, setUser, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
