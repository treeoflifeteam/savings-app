import { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Load logged-in user only
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // 💾 Persist token and user
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const formatError = (err) => {
    const validationErrors = err.response?.data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors
        .map((item) => `${item.field}: ${item.message}`)
        .join(" | ");
    }

    return err.response?.data?.msg || err.message || "An error occurred";
  };

  const register = async (name, phone, password) => {
    try {
      setError(null);
      const response = await authService.register(name, phone, password);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = formatError(err);
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const login = async (phone, password) => {
    try {
      setError(null);
      const response = await authService.login(phone, password);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = formatError(err);
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
