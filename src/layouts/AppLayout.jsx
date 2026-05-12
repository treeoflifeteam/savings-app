import { Outlet, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { useState } from "react";

import { Bell, ChevronDown, Menu } from "lucide-react";

import { sidebarMenus } from "../config/sidebarMenus";

import { routeMeta } from "../config/routeMeta";

import "../styles/AppLayout.css";

const AppLayout = () => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const { user, logout } = useAuth();

  const userRole = user?.role || "user";

  // =========================
  // BREADCRUMB
  // =========================

  const currentRoute = routeMeta[location.pathname];

  const currentPage = currentRoute?.title || "Dashboard";

  return (
    <div className="app-shell">
      {/* =====================
          MOBILE OVERLAY
      ====================== */}

      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* =====================
          SIDEBAR
      ====================== */}

      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        {/* LOGO */}

        <div className="sidebar-logo">
          <div className="logo-icon">K</div>

          {!collapsed && (
            <div>
              <h2>KoloPay</h2>

              <p>Smart Savings</p>
            </div>
          )}
        </div>

        {/* NAV */}

        <nav className="sidebar-nav">
          {sidebarMenus[userRole].map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} />

                {!collapsed && (
                  <>
                    <span>{item.name}</span>

                    {item.name === "Notifications" && (
                      <div className="notification-badge">3</div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* USER */}

        <div className="sidebar-user glass-card">
          <div className="user-avatar">{user?.fullName?.[0] ||
  "U"}</div>

          {!collapsed && (
            <div>
              <h4>
  {user?.fullName ||
    "User"}
</h4>

              <p>
  {userRole}
</p>
            </div>
          )}
        </div>
      </aside>

      {/* =====================
          MAIN
      ====================== */}

      <div className={`main-wrapper ${collapsed ? "expanded" : ""}`}>
        {/* =================
            TOPBAR
        ================== */}

        <header className="topbar glass-card">
          {/* LEFT */}

          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>

            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "→" : "←"}
            </button>

            <div className="breadcrumb">
  <span>
    KoloPay
  </span>

  <span className="crumb-separator">
    /
  </span>

  <span className="active-crumb">
    {currentPage}
  </span>
</div>

          </div>

          {/* RIGHT */}

          <div className="topbar-right">
            {/* NOTIFICATIONS */}

            <div className="topbar-dropdown-wrapper">
              <button
                className="icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />

                <span className="topbar-badge">3</span>
              </button>

              {showNotifications && (
                <div className="dropdown-card">
                  <h4>Notifications</h4>

                  <div className="dropdown-item">Deposit processed</div>

                  <div className="dropdown-item">Withdrawal successful</div>

                  <div className="dropdown-item">Bonus earned</div>
                </div>
              )}
            </div>

            {/* PROFILE */}

            <div className="topbar-dropdown-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="user-avatar small">{user?.fullName?.[0] ||
  "U"}</div>

                <ChevronDown size={16} />
              </button>

              {showProfile && (
                <div className="dropdown-card">
                  <div className="dropdown-item">Profile</div>

                  <div className="dropdown-item">Settings</div>

                  <div
  className="dropdown-item danger"
  onClick={logout}
>
  Logout
</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================
            PAGE CONTENT
        ================== */}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
