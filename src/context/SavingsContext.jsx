import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../services/api";
import { useAuth } from "./AuthContext";

const SavingsContext = createContext();

export const SavingsProvider = ({ children }) => {
  // ======================================
  // STATE MANAGEMENT
  // ======================================

  // Cycles State
  const [cycles, setCycles] = useState([]);
  const [cyclesLoading, setCyclesLoading] = useState(false);
  const [cyclesError, setCyclesError] = useState(null);

  // Wallet State
  const [wallet, setWallet] = useState({
    availableBalance: 0,
    lockedBalance: 0,
    pendingCommission: 0,
  });
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

  // Dashboard State
  const [dashboardStats, setDashboardStats] = useState({
    walletBalance: 0,
    lockedSavings: 0,
    totalSavings: 0,
    activeCycles: 0,
    completedCycles: 0,
    pendingDeposits: 0,
  });
  const [dashboardRecentTransactions, setDashboardRecentTransactions] =
    useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Transactions State
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  // Contribution State (for payment flow)
  const [contributionLoading, setContributionLoading] = useState(false);
  const [contributionError, setContributionError] = useState(null);

  // General loading state
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const isUser = user?.role === "user";

  // ======================================
  // CYCLES MANAGEMENT
  // ======================================

  const fetchCycles = useCallback(async () => {
    if (!isUser) return;

    try {
      setCyclesLoading(true);
      setCyclesError(null);

      const res = await API.get("/cycles/my-cycles");
      setCycles(res.data.cycles || []);
    } catch (err) {
      console.error("Error fetching cycles:", err);
      setCyclesError(err.response?.data?.message || "Failed to fetch cycles");
    } finally {
      setCyclesLoading(false);
    }
  }, [isUser]);

  const createCycle = async (cycleData) => {
    try {
      setCyclesLoading(true);
      setCyclesError(null);

      const payload = {
        ...cycleData,
        userId: cycleData.userId || user?.id || user?._id,
      };

      const res = await API.post("/cycles/", payload);

      // Refresh cycles after creation
      await fetchCycles();

      return res.data;
    } catch (err) {
      console.error("Error creating cycle:", err);
      setCyclesError(err.response?.data?.message || "Failed to create cycle");
      throw err;
    } finally {
      setCyclesLoading(false);
    }
  };

  // ======================================
  // WALLET MANAGEMENT
  // ======================================

  const fetchWallet = useCallback(async () => {
    if (!isUser) return;

    try {
      setWalletLoading(true);
      setWalletError(null);
      setDashboardLoading(true);
      setDashboardError(null);

      const res = await API.get("/dashboard/user");

      setWallet({
        availableBalance: res.data.wallet?.availableBalance || 0,
        lockedBalance: res.data.wallet?.lockedBalance || 0,
        pendingCommission: res.data.wallet?.pendingCommission || 0,
      });

      setDashboardStats({
        walletBalance: res.data.stats?.walletBalance || 0,
        lockedSavings: res.data.stats?.lockedSavings || 0,
        totalSavings:
          res.data.stats?.totalSavings ||
          (res.data.stats?.walletBalance || 0) +
            (res.data.wallet?.lockedBalance || 0),
        activeCycles: res.data.stats?.activeCycles || 0,
        completedCycles: res.data.stats?.completedCycles || 0,
        pendingDeposits: res.data.stats?.pendingDeposits || 0,
      });

      setDashboardRecentTransactions(res.data.recentTransactions || []);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setWalletError(err.response?.data?.message || "Failed to fetch wallet");
      setDashboardError(
        err.response?.data?.message || "Failed to fetch dashboard data",
      );
    } finally {
      setWalletLoading(false);
      setDashboardLoading(false);
    }
  }, [isUser]);

  // ======================================
  // TRANSACTIONS MANAGEMENT
  // ======================================

  const fetchTransactions = useCallback(async () => {
    if (!isUser) return;

    try {
      setTransactionsLoading(true);
      setTransactionsError(null);

      const res = await API.get("/transactions/");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactionsError(
        err.response?.data?.message || "Failed to fetch transactions",
      );
    } finally {
      setTransactionsLoading(false);
    }
  }, [isUser]);
  // ======================================

  const makeContribution = async (contributionData) => {
    try {
      setContributionLoading(true);
      setContributionError(null);

      const res = await API.post("/cycles/contribute", contributionData);

      // Refresh wallet and cycles after contribution
      await Promise.all([fetchWallet(), fetchCycles()]);

      return res.data;
    } catch (err) {
      console.error("Error making contribution:", err);
      setContributionError(
        err.response?.data?.message || "Failed to make contribution",
      );
      throw err;
    } finally {
      setContributionLoading(false);
    }
  };

  // ======================================
  // WITHDRAWAL MANAGEMENT
  // ======================================

  const requestWithdrawal = async (withdrawalData) => {
    try {
      setWalletLoading(true);
      setWalletError(null);

      const res = await API.post("/withdrawals/request", withdrawalData);

      // Refresh wallet after withdrawal request
      await fetchWallet();

      return res.data;
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      setWalletError(
        err.response?.data?.message || "Failed to request withdrawal",
      );
      throw err;
    } finally {
      setWalletLoading(false);
    }
  };

  // ======================================
  // REFRESH ALL DATA
  // ======================================

  const refreshAllData = useCallback(async () => {
    if (!isUser) return;

    try {
      setRefreshing(true);
      await Promise.all([fetchCycles(), fetchWallet(), fetchTransactions()]);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setRefreshing(false);
    }
  }, [isUser, fetchCycles, fetchWallet, fetchTransactions]);

  // ======================================
  // INITIAL DATA LOAD
  // ======================================

  useEffect(() => {
    if (isUser) {
      refreshAllData();
    } else {
      // Clear data when user logs out or when a non-user role signs in
      setCycles([]);
      setWallet({
        availableBalance: 0,
        lockedBalance: 0,
        pendingCommission: 0,
      });
      setTransactions([]);
    }
  }, [isUser, refreshAllData]);

  // ======================================
  // COMPUTED VALUES
  // ======================================

  const activeCycles = cycles.filter((cycle) => cycle.status === "active");
  const completedCycles = cycles.filter(
    (cycle) => cycle.status === "completed",
  );
  const totalSavings = wallet.availableBalance + wallet.lockedBalance;
  const canWithdraw = wallet.availableBalance > 0;

  // ======================================
  // CONTEXT VALUE
  // ======================================

  const value = {
    // State
    cycles,
    wallet,
    dashboardStats,
    dashboardRecentTransactions,
    transactions,

    // Loading states
    cyclesLoading,
    walletLoading,
    dashboardLoading,
    transactionsLoading,
    contributionLoading,
    refreshing,

    // Error states
    cyclesError,
    walletError,
    dashboardError,
    transactionsError,
    contributionError,

    // Actions
    fetchCycles,
    createCycle,
    fetchWallet,
    fetchTransactions,
    makeContribution,
    requestWithdrawal,
    refreshAllData,

    // Computed values
    activeCycles,
    completedCycles,
    totalSavings,
    canWithdraw,
  };

  return (
    <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
  );
};

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
};
