import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Bell,
  Users,
  Shield,
  Activity,
  CreditCard,
  Landmark,
  BarChart3,
} from "lucide-react";

export const sidebarMenus =
  {
    user: [
      {
        label:
          "Dashboard",

        path:
          "/dashboard",

        icon:
          LayoutDashboard,
      },

      {
        label:
          "Savings",

        path:
          "/savings",

        icon:
          PiggyBank,
      },

      {
        label:
          "Wallet",

        path:
          "/wallet",

        icon: Wallet,
      },

      {
        label:
          "Notifications",

        path:
          "/notifications",

        icon: Bell,
      },
    ],

    agent: [
      {
        label:
          "Dashboard",

        path:
          "/agent",

        icon:
          Users,
      },

      {
        label:
          "Wallet",

        path:
          "/wallet",

        icon: Wallet,
      },
    ],

    admin: [
      {
        label:
          "Dashboard",

        path:
          "/admin",

        icon:
          Shield,
      },

      {
        label:
          "Transactions",

        path:
          "/admin/transactions",

        icon:
          Activity,
      },

      {
        label:
          "Withdrawals",

        path:
          "/admin/withdrawals",

        icon:
          CreditCard,
      },

      {
        label:
          "Reconciliation",

        path:
          "/admin/reconciliation",

        icon:
          Landmark,
      },

      {
        label:
          "Analytics",

        path:
          "/admin/analytics",

        icon:
          BarChart3,
      },
    ],
  };