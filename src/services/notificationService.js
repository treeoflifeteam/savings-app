const STORAGE_KEY = "koloPayNotifications";

const defaultNotifications = [
  {
    id: "notif-1",
    type: "success",
    title: "Savings Deposit Processed",
    message: "₦2,100 has been successfully added to your daily savings cycle.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    category: "transaction",
    unread: true,
  },
  {
    id: "notif-2",
    type: "pending",
    title: "Deposit Awaiting Review",
    message: "Your ₦5,050 transfer is pending admin reconciliation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    category: "deposit",
    unread: true,
  },
  {
    id: "notif-3",
    type: "bonus",
    title: "Referral Bonus Earned",
    message: "You received ₦300 first cycle reward bonus.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    category: "reward",
    unread: false,
  },
  {
    id: "notif-4",
    type: "withdrawal",
    title: "Withdrawal Successful",
    message: "₦15,000 has been sent to your GTBank account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: "withdrawal",
    unread: false,
  },
  {
    id: "notif-5",
    type: "warning",
    title: "Missing Narration Detected",
    message: "Your recent transfer was received without your savings code.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: "alert",
    unread: false,
  },
];

const loadFromStore = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.warn("Invalid notification storage, resetting.", error);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotifications));
  return defaultNotifications;
};

export const getNotifications = async () => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(loadFromStore());
    }, 220);
  });
};

export const markAllNotificationsRead = async () => {
  return new Promise((resolve) => {
    const notifications = loadFromStore().map((notification) => ({
      ...notification,
      unread: false,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.setTimeout(() => {
      resolve(notifications);
    }, 150);
  });
};

export const updateNotifications = async (notifications) => {
  return new Promise((resolve) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.setTimeout(() => {
      resolve(notifications);
    }, 100);
  });
};
