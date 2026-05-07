import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { adminService, savingsService } from "../services/api";

const SavingsContext = createContext();

function normalizeTransaction(tx) {
  if (!tx) return null;
  return {
    ...tx,
    id: tx.id ?? (typeof tx._id === "string" ? tx._id : tx._id?.toString?.()),
  };
}

function normalizeUser(user) {
  if (!user) return null;

  const u = typeof user.toObject === "function" ? user.toObject() : user;
  const id = u.id ?? (typeof u._id === "string" ? u._id : u._id?.toString?.());

  const transactions = Array.isArray(u.transactions)
    ? u.transactions.map(normalizeTransaction).filter(Boolean)
    : [];

  return {
    ...u,
    id,
    transactions,
  };
}

export function SavingsProvider({ children }) {
  const { user: authUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [ready, setReady] = useState(false);
  const [activeUserId, setActiveUserId] = useState(() =>
    localStorage.getItem("activeUserId"),
  );

  // ---------------- persist active user ----------------
  useEffect(() => {
    if (activeUserId) localStorage.setItem("activeUserId", activeUserId);
    else localStorage.removeItem("activeUserId");
  }, [activeUserId]);

  const refreshCurrentUser = useCallback(async () => {
    const resp = await savingsService.getProfile();
    const current = normalizeUser(resp.data);

    setUsers([current]);
    setActiveUserId(current.id);
    setReady(true);
  }, []);

  const refreshAllUsers = useCallback(async () => {
    const resp = await adminService.getAllUsers();
    const list = (resp.data || []).map(normalizeUser).filter(Boolean);

    setUsers(list);
    setReady(true);
  }, []);

  const fetchUserById = useCallback(async (userId) => {
    const resp = await adminService.getUserById(userId);
    return normalizeUser(resp.data);
  }, []);

  // Load current user from backend when auth is ready
  useEffect(() => {
    if (authLoading) return;
    if (!(authUser?.id || authUser?._id)) return;

    refreshCurrentUser().catch(() => {
      // If token is invalid/expired, just stop rendering ready state.
      setUsers([]);
      setReady(false);
    });
  }, [authUser?.id, authUser?._id, authLoading, refreshCurrentUser]);

  // ---------------- user actions (authenticated user) ----------------
  const startNewCycle = useCallback(
    async (_userId, dailyAmount, totalDays) => {
      await savingsService.startCycle(dailyAmount, totalDays);
      await refreshCurrentUser();
    },
    [refreshCurrentUser],
  );

  const addSavings = useCallback(
    async (days, method = "app") => {
      await savingsService.addSavings(days, method);
      await refreshCurrentUser();
    },
    [refreshCurrentUser],
  );

  const withdraw = useCallback(
    async (_userId, amount) => {
      await savingsService.withdraw(amount);
      await refreshCurrentUser();
    },
    [refreshCurrentUser],
  );

  // ---------------- admin actions ----------------
  const createUser = useCallback(
    async (name, phone, password) => {
      const resp = await adminService.createUser(name, phone, password);
      await refreshAllUsers();
      return resp.data;
    },
    [refreshAllUsers],
  );

  const adminStartCycle = useCallback(
    async (userId, dailyAmount, totalDays) => {
      const resp = await adminService.startCycle(
        userId,
        dailyAmount,
        totalDays,
      );
      await refreshAllUsers();
      return resp.data;
    },
    [refreshAllUsers],
  );

  const adminAddSavings = useCallback(
    async (userId, days, method = "manual") => {
      const resp = await adminService.addSavings(userId, days, method);
      await refreshAllUsers();
      return resp.data;
    },
    [refreshAllUsers],
  );

  const adminWithdraw = useCallback(
    async (userId, amount) => {
      const resp = await adminService.withdraw(userId, amount);
      await refreshAllUsers();
      return resp.data;
    },
    [refreshAllUsers],
  );

  return (
    <SavingsContext.Provider
      value={{
        users,
        setUsers,
        ready,
        activeUserId,
        setActiveUserId,

        // user actions
        startNewCycle,
        addSavings,
        withdraw,

        // admin actions
        createUser,
        adminStartCycle,
        adminAddSavings,
        adminWithdraw,

        // loaders
        refreshAllUsers,
        fetchUserById,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  return useContext(SavingsContext);
}
