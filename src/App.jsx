import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Savings from "./pages/Savings";
import ProtectedRoute from "./components/ProtectedRoutes";
import AppLayout from "./components/AppLayout";
import History from "./pages/History";
import CycleSetup from "./pages/CycleSetup";
import Withdraw from "./pages/Withdraw";
import TransactionHistory from "./pages/TransactionHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUser";
import AdminReports from "./pages/AdminReports";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const withLayout = (element) => (
    <ProtectedRoute>
      <AppLayout>{element}</AppLayout>
    </ProtectedRoute>
  );

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={withLayout(<Dashboard />)} />
        <Route path="/setup" element={withLayout(<CycleSetup />)} />
        <Route
          path="/admin-dashboard"
          element={withLayout(<AdminDashboard />)}
        />
        <Route path="/admin-users" element={withLayout(<AdminUsers />)} />
        <Route path="/admin-reports" element={withLayout(<AdminReports />)} />
        <Route
          path="/transaction-history"
          element={withLayout(<TransactionHistory />)}
        />
        <Route path="/withdraw" element={withLayout(<Withdraw />)} />
        <Route path="/savings-history" element={withLayout(<History />)} />
        <Route path="/savings" element={withLayout(<Savings />)} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
