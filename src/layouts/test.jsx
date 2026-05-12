import {
  Outlet,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  LayoutDashboard,
  Wallet,
  Bell,
  BarChart3,
  PiggyBank,
  Users,
  ShieldCheck,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import "../styles/AppLayout.css";

const AppLayout = () => {
  const location =
    useLocation();

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const userRole = "user";

  // =========================
  // MENUS
  // =========================

  const menus = {
    user: [
      {
        name: "Dashboard",
        icon:
          LayoutDashboard,
        path:
          "/dashboard",
      },

      {
        name: "Savings",
        icon:
          PiggyBank,
        path:
          "/savings",
      },

      {
        name: "Wallet",
        icon: Wallet,
        path:
          "/wallet",
      },

      {
        name: "Analytics",
        icon:
          BarChart3,
        path:
          "/analytics",
      },

      {
        name:
          "Notifications",
        icon: Bell,
        path:
          "/notifications",
      },
    ],

    agent: [
      {
        name: "Dashboard",
        icon:
          LayoutDashboard,
        path:
          "/agent/dashboard",
      },

      {
        name:
          "Referrals",
        icon: Users,
        path:
          "/agent/referrals",
      },

      {
        name: "Wallet",
        icon: Wallet,
        path:
          "/agent/wallet",
      },
    ],

    admin: [
      {
        name: "Overview",
        icon:
          LayoutDashboard,
        path:
          "/admin/dashboard",
      },

      {
        name: "Users",
        icon: Users,
        path:
          "/admin/users",
      },

      {
        name:
          "Operations",
        icon:
          ShieldCheck,
        path:
          "/admin/operations",
      },

      {
        name:
          "Settings",
        icon:
          Settings,
        path:
          "/admin/settings",
      },
    ],
  };

  // =========================
  // BREADCRUMB
  // =========================

  const currentPage =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop();

  return (
    <div className="app-shell">
      {/* =====================
          MOBILE OVERLAY
      ====================== */}

      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        />
      )}

      {/* =====================
          SIDEBAR
      ====================== */}

      <aside
        className={`sidebar ${
          collapsed
            ? "collapsed"
            : ""
        } ${
          mobileOpen
            ? "mobile-open"
            : ""
        }`}
      >
        {/* LOGO */}

        <div className="sidebar-logo">
          <div className="logo-icon">
            K
          </div>

          {!collapsed && (
            <div>
              <h2>
                KoloPay
              </h2>

              <p>
                Smart Savings
              </p>
            </div>
          )}
        </div>

        {/* NAV */}

        <nav className="sidebar-nav">
          {menus[
            userRole
          ].map((item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={
                  item.name
                }
                to={item.path}
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Icon size={20} />

                {!collapsed && (
                  <>
                    <span>
                      {
                        item.name
                      }
                    </span>

                    {item.name ===
                      "Notifications" && (
                      <div className="notification-badge">
                        3
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* USER */}

        <div className="sidebar-user glass-card">
          <div className="user-avatar">
            S
          </div>

          {!collapsed && (
            <div>
              <h4>
                Samuel
              </h4>

              <p>
                Premium Saver
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* =====================
          MAIN
      ====================== */}

      <div
        className={`main-wrapper ${
          collapsed
            ? "expanded"
            : ""
        }`}
      >
        {/* =================
            TOPBAR
        ================== */}

        <header className="topbar glass-card">
          {/* LEFT */}

          <div className="topbar-left">
            <button
              className="menu-btn"
              onClick={() =>
                setMobileOpen(
                  true
                )
              }
            >
              <Menu size={22} />
            </button>

            <button
              className="collapse-btn"
              onClick={() =>
                setCollapsed(
                  !collapsed
                )
              }
            >
              {collapsed
                ? "→"
                : "←"}
            </button>

            <div className="breadcrumb">
              Dashboard /
              <span>
                {" "}
                {
                  currentPage
                }
              </span>
            </div>
          </div>

          {/* RIGHT */}

          <div className="topbar-right">
            {/* NOTIFICATIONS */}

            <div className="topbar-dropdown-wrapper">
              <button
                className="icon-btn"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
              >
                <Bell
                  size={20}
                />

                <span className="topbar-badge">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="dropdown-card">
                  <h4>
                    Notifications
                  </h4>

                  <div className="dropdown-item">
                    Deposit
                    processed
                  </div>

                  <div className="dropdown-item">
                    Withdrawal
                    successful
                  </div>

                  <div className="dropdown-item">
                    Bonus earned
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}

            <div className="topbar-dropdown-wrapper">
              <button
                className="profile-btn"
                onClick={() =>
                  setShowProfile(
                    !showProfile
                  )
                }
              >
                <div className="user-avatar small">
                  S
                </div>

                <ChevronDown
                  size={16}
                />
              </button>

              {showProfile && (
                <div className="dropdown-card">
                  <div className="dropdown-item">
                    Profile
                  </div>

                  <div className="dropdown-item">
                    Settings
                  </div>

                  <div className="dropdown-item danger">
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