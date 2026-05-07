import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Flag to prevent infinite loops on token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired or invalid)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/register"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(API(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newToken = response.data.token;
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ============ AUTH SERVICES ============
export const authService = {
  register: (name, phone, password) =>
    API.post("/auth/register", { name, phone, password }),

  login: (phone, password) => API.post("/auth/login", { phone, password }),

  refreshToken: () => API.post("/auth/refresh"),
};

// ============ SAVINGS SERVICES ============
export const savingsService = {
  getProfile: () => API.get("/savings/profile"),

  startCycle: (dailyAmount, totalDays) =>
    API.post("/savings/cycle/start", { dailyAmount, totalDays }),

  addSavings: (days, method = "app") =>
    API.post("/savings/add", { days, method }),

  withdraw: (amount) => API.post("/savings/withdraw", { amount }),

  getTransactions: () => API.get("/savings/transactions"),
};

// ============ ADMIN SERVICES ============
export const adminService = {
  getAllUsers: () => API.get("/savings/users"),

  getUserById: (userId) => API.get(`/savings/users/${userId}`),

  createUser: (name, phone, password) =>
    API.post("/savings/admin/users/create", { name, phone, password }),

  getAllTransactions: () => API.get("/savings/admin/transactions"),

  // Admin actions on specific user
  startCycle: (userId, dailyAmount, totalDays) =>
    API.post(`/savings/admin/cycle/start/${userId}`, {
      dailyAmount,
      totalDays,
    }),

  addSavings: (userId, days, method = "manual") =>
    API.post(`/savings/admin/savings/add/${userId}`, { days, method }),

  withdraw: (userId, amount) =>
    API.post(`/savings/admin/withdraw/${userId}`, { amount }),
};

// ============ PAYMENT SERVICES ============
export const paymentService = {
  initializePayment: (amount, days, cycleId) =>
    API.post("/payments/initialize", { amount, days, cycleId }),

  verifyPayment: (reference) => API.get(`/payments/verify/${reference}`),

  getPaymentHistory: () => API.get("/payments/history"),
};

export default API;
