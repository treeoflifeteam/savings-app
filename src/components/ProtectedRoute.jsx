import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    // Store the current path for redirect after login
    localStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search,
    );
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
