import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Users,
  Bell,
  Shield,
  Activity,
  CreditCard,
  Landmark,
} from "lucide-react";

export const routeMeta = {
  // =========================
  // USER
  // =========================

  "/dashboard": {
    title: "Dashboard",

    icon:
      LayoutDashboard,
  },

  "/wallet": {
    title: "Wallet",

    icon: Wallet,
  },

  "/savings": {
    title: "Savings",

    icon: PiggyBank,
  },

  "/notifications": {
    title:
      "Notifications",

    icon: Bell,
  },

  // =========================
  // AGENT
  // =========================

  "/agent": {
    title:
      "Agent Dashboard",

    icon: Users,
  },

  // =========================
  // ADMIN
  // =========================

  "/admin": {
    title:
      "Admin Dashboard",

    icon: Shield,
  },

  "/admin/transactions": {
    title:
      "Transactions",

    icon: Activity,
  },

  "/admin/withdrawals": {
    title:
      "Withdrawals",

    icon:
      CreditCard,
  },

  "/admin/reconciliation": {
    title:
      "Reconciliation",

    icon:
      Landmark,
  },
};