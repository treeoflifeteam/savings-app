import {
  TrendingUp,
  Users,
  Wallet,
  PiggyBank,
  ShieldAlert,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "../../styles/SystemAnalytics.css";

const savingsData = [
  {
    month: "Jan",
    savings: 400000,
  },

  {
    month: "Feb",
    savings: 620000,
  },

  {
    month: "Mar",
    savings: 980000,
  },

  {
    month: "Apr",
    savings: 1200000,
  },

  {
    month: "May",
    savings: 1600000,
  },
];

const userGrowth = [
  {
    month: "Jan",
    users: 120,
  },

  {
    month: "Feb",
    users: 280,
  },

  {
    month: "Mar",
    users: 510,
  },

  {
    month: "Apr",
    users: 890,
  },

  {
    month: "May",
    users: 1420,
  },
];

const SystemAnalytics =
  () => {
    return (
      <div className="page-container">
        {/* =====================
            HEADER
        ====================== */}

        <div className="sa-header glass-card">
          <div>
            <h1>
              System Analytics
            </h1>

            <p className="text-muted">
              Executive insights,
              financial growth
              trends and platform
              intelligence across
              KoloPay.
            </p>
          </div>
        </div>

        {/* =====================
            KPI CARDS
        ====================== */}

        <div className="sa-kpi-grid">
          <div className="glass-card sa-kpi-card">
            <div className="sa-icon green">
              <PiggyBank
                size={22}
              />
            </div>

            <div>
              <span>
                Total Savings
              </span>

              <h2>
                ₦42.8M
              </h2>
            </div>
          </div>

          <div className="glass-card sa-kpi-card">
            <div className="sa-icon blue">
              <Users size={22} />
            </div>

            <div>
              <span>
                Active Users
              </span>

              <h2>
                8,421
              </h2>
            </div>
          </div>

          <div className="glass-card sa-kpi-card">
            <div className="sa-icon yellow">
              <Wallet
                size={22}
              />
            </div>

            <div>
              <span>
                Withdrawals
              </span>

              <h2>
                ₦12.4M
              </h2>
            </div>
          </div>

          <div className="glass-card sa-kpi-card">
            <div className="sa-icon red">
              <ShieldAlert
                size={22}
              />
            </div>

            <div>
              <span>
                Fraud Alerts
              </span>

              <h2>
                12
              </h2>
            </div>
          </div>
        </div>

        {/* =====================
            CHARTS
        ====================== */}

        <div className="sa-chart-grid">
          {/* SAVINGS GROWTH */}

          <div className="glass-card chart-card">
            <div className="chart-header">
              <h3>
                Savings Growth
              </h3>

              <div className="growth-badge">
                <TrendingUp
                  size={16}
                />

                +24%
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <AreaChart
                data={
                  savingsData
                }
              >
                <defs>
                  <linearGradient
                    id="colorSavings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#16a34a"
                      stopOpacity={
                        0.4
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#16a34a"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#16a34a"
                  fillOpacity={
                    1
                  }
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* USER GROWTH */}

          <div className="glass-card chart-card">
            <div className="chart-header">
              <h3>
                User Growth
              </h3>

              <div className="growth-badge blue">
                <TrendingUp
                  size={16}
                />

                +38%
              </div>
            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart
                data={
                  userGrowth
                }
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="users"
                  fill="#2563eb"
                  radius={[
                    8, 8, 0, 0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =====================
            INSIGHT PANEL
        ====================== */}

        <div className="glass-card sa-insights">
          <h3>
            Platform Insights
          </h3>

          <div className="insight-list">
            <div className="insight-item">
              Savings volume
              increased by 24%
              compared to last
              month.
            </div>

            <div className="insight-item">
              Agent referrals
              contributed 61% of
              new users.
            </div>

            <div className="insight-item">
              Withdrawal success
              rate is currently
              98.7%.
            </div>

            <div className="insight-item">
              Fraud detection
              flagged 12 unusual
              transactions this
              week.
            </div>
          </div>
        </div>
      </div>
    );
  };

export default SystemAnalytics;