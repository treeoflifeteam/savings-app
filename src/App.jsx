import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import UserDashboard from "./pages/user/UserDashboard";
import UserSavings from "./pages/user/UserSavings";
import WalletPage from "./pages/user/WalletPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import AnalyticsPage from "./pages/user/AnalyticsPage";
import AppLayout from "./layouts/AppLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import TransactionMonitoring from "./pages/admin/TransactionMonitoring";
import PendingDeposits from "./pages/admin/PendingDeposits";
import UserManagement from "./pages/admin/UserManagement";
import WithdrawalOperations from "./pages/admin/WithdrawalOperations";
import ReconciliationCenter from "./pages/admin/ReconciliationCenter";

import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentOperations from "./pages/agent/AgentOperations";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

const RouteTracker = () => {
  const location = useLocation();
  const { saveRoute, user } = useAuth();

  useEffect(() => {
    // Only save route if user is logged in and not on auth pages
    if (
      user &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      saveRoute(location.pathname);
    }
  }, [location.pathname, user, saveRoute]);

  return null;
};

const RootRedirect = () => {
  const { user, loading, lastRoute, saveRoute } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (user) {
    // User is logged in - restore last route or go to dashboard
    const routeToRestore =
      lastRoute && lastRoute !== "/"
        ? lastRoute
        : user.role === "admin"
          ? "/admin"
          : user.role === "agent"
            ? "/agent"
            : "/user";
    return <Navigate to={routeToRestore} />;
  }

  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route
            path="/user/*"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/savings"
            element={
              <ProtectedRoute role="user">
                <UserSavings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/wallet"
            element={
              <ProtectedRoute role="user">
                <WalletPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute role="user">
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/analytics"
            element={
              <ProtectedRoute role="user">
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transaction-monitoring"
          element={
            <ProtectedRoute role="admin">
              {" "}
              <TransactionMonitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user-management"
          element={
            <ProtectedRoute role="admin">
              {" "}
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/withdrawal-operations"
          element={
            <ProtectedRoute role="admin">
              {" "}
              <WithdrawalOperations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reconciliation"
          element={
            <ProtectedRoute role="admin">
              {" "}
              <ReconciliationCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending-deposits"
          element={
            <ProtectedRoute role="admin">
              {" "}
              <PendingDeposits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/*"
          element={
            <ProtectedRoute role="agent">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/operations"
          element={
            <ProtectedRoute role="agent">
              <AgentOperations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
