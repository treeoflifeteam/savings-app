import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <NavLink to="/dashboard" className="brand-link">
            Tree of Life
          </NavLink>
          <span className="app-user">
            {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Welcome"}
          </span>
        </div>

        <nav className="app-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/savings"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Savings
          </NavLink>
          <NavLink
            to="/withdraw"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Withdraw
          </NavLink>
          <NavLink
            to="/savings-history"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            History
          </NavLink>
          <NavLink
            to="/transaction-history"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            Transactions
          </NavLink>
          {user?.isAdmin && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Admin
              </NavLink>
              <NavLink
                to="/admin-users"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                Users
              </NavLink>
            </>
          )}
        </nav>

        <div className="app-actions">
          <button
            type="button"
            className="btn btn-secondary nav-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">{children}</main>
    </div>
  );
}
