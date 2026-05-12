import { createContext, useContext, useEffect, useState } from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [lastRoute, setLastRoute] = useState(
    () => localStorage.getItem("lastRoute") || "/",
  );

  // ======================================
  // LOAD USER
  // ======================================

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get("/auth/me");

      setUser(res.data.user);
    } catch (err) {
      console.log(err);

      logout();
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOGIN
  // ======================================

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);

    localStorage.setItem("role", res.data.user.role);

    setUser(res.data.user);

    return res.data;
  };

  // ======================================
  // REGISTER
  // ======================================

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);

    return res.data;
  };

  // ======================================
  // LOGOUT
  // ======================================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("lastRoute");

    setUser(null);
  };

  const saveRoute = (route) => {
    localStorage.setItem("lastRoute", route);
    setLastRoute(route);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        lastRoute,
        saveRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
