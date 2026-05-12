import { useEffect, useState, useMemo } from "react";

import "../../styles/NotificationsPage.css";
import {
  getNotifications,
  markAllNotificationsRead,
} from "../../services/notificationService";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonBlock from "../../components/ui/SkeletonBlock";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const items = await getNotifications();
        setNotifications(items);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const handleMarkAllRead = async () => {
    const updated = await markAllNotificationsRead();
    setNotifications(updated);
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";

      case "pending":
        return "⏳";

      case "bonus":
        return "🎁";

      case "withdrawal":
        return "↑";

      case "warning":
        return "⚠";

      default:
        return "•";
    }
  };

  return (
    <div className="page-container">
      <div className="notifications-header glass-card">
        <div>
          <h1>Notifications</h1>

          <p className="text-muted">
            Stay updated with all account activities and transaction alerts.
          </p>
        </div>

        <button
          className="mark-read-btn"
          onClick={handleMarkAllRead}
          disabled={loading || unreadCount === 0}
        >
          {unreadCount > 0 ? `Mark All Read (${unreadCount})` : "All Read"}
        </button>
      </div>

      <div className="notifications-list">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div
              key={index}
              className="glass-card notification-item skeleton-card"
            >
              <div
                className="notification-icon skeleton"
                style={{ width: 48, height: 48 }}
              />
              <div className="notification-content">
                <SkeletonBlock width="50%" height="18px" className="mb-8" />
                <SkeletonBlock width="100%" height="14px" className="mb-4" />
                <SkeletonBlock width="80%" height="14px" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="🔕"
            title="No notifications yet"
            subtitle="We will show important account activity and updates here."
          />
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`glass-card notification-item ${item.unread ? "unread" : ""}`}
            >
              <div className={`notification-icon ${item.type}`}>
                {getIcon(item.type)}
              </div>

              <div className="notification-content">
                <div className="notification-top">
                  <h3>{item.title}</h3>

                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>

                <p>{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
