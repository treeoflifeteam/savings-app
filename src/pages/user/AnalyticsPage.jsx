import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { useMemo } from "react";
import { useSavings } from "../../context/SavingsContext";
import SkeletonBlock from "../../components/ui/SkeletonBlock";
import EmptyState from "../../components/ui/EmptyState";
import "../../styles/AnalyticsPage.css";

const data = [
  {
    month: "Jan",
    savings: 12000,
  },

  {
    month: "Feb",
    savings: 18000,
  },

  {
    month: "Mar",
    savings: 25000,
  },

  {
    month: "Apr",
    savings: 32000,
  },

  {
    month: "May",
    savings: 45000,
  },

  {
    month: "Jun",
    savings: 60000,
  },
];

const AnalyticsPage = () => {
  const {
    cycles,
    transactions,
    dashboardStats,
    cyclesLoading,
    transactionsLoading,
    dashboardLoading,
  } = useSavings();

  // Calculate monthly savings data
  const monthlyData = useMemo(() => {
    if (!cycles.length) return [];

    const monthlyMap = new Map();

    cycles.forEach((cycle) => {
      const date = new Date(cycle.startDate);
      const monthKey = date.toLocaleString("default", { month: "short" });

      if (monthlyMap.has(monthKey)) {
        monthlyMap.set(
          monthKey,
          monthlyMap.get(monthKey) + (cycle.totalSaved || 0),
        );
      } else {
        monthlyMap.set(monthKey, cycle.totalSaved || 0);
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, savings]) => ({
      month,
      savings,
    }));
  }, [cycles]);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    if (!cycles.length && !transactions.length) {
      return {
        currentStreak: 0,
        totalSaved: 0,
        completedCycles: 0,
        monthlyGrowth: 0,
        consistencyScore: 0,
      };
    }

    // Calculate total saved
    const totalSaved = cycles.reduce(
      (sum, cycle) => sum + (cycle.totalSaved || 0),
      0,
    );

    // Calculate completed cycles
    const completedCycles = cycles.filter(
      (cycle) => cycle.status === "completed",
    ).length;

    // Calculate monthly growth (compare last two months)
    const sortedMonthly = [...monthlyData].sort((a, b) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    let monthlyGrowth = 0;
    if (sortedMonthly.length >= 2) {
      const lastMonth = sortedMonthly[sortedMonthly.length - 1].savings;
      const prevMonth = sortedMonthly[sortedMonthly.length - 2].savings;
      if (prevMonth > 0) {
        monthlyGrowth = Math.round(((lastMonth - prevMonth) / prevMonth) * 100);
      }
    }

    // Calculate current streak (consecutive contribution days)
    let currentStreak = 0;
    if (transactions.length > 0) {
      const contributionTransactions = transactions
        .filter((t) => t.type === "contribution")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (contributionTransactions.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let checkDate = new Date(today);
        let streakCount = 0;

        // Check consecutive days backwards from today
        for (let i = 0; i < 365; i++) {
          // Max 365 days
          const hasContribution = contributionTransactions.some((t) => {
            const transDate = new Date(t.createdAt);
            transDate.setHours(0, 0, 0, 0);
            return transDate.getTime() === checkDate.getTime();
          });

          if (hasContribution) {
            streakCount++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        currentStreak = streakCount;
      }
    }

    // Calculate consistency score (percentage of expected contributions made)
    let consistencyScore = 0;
    if (cycles.length > 0) {
      const totalExpected = cycles.reduce(
        (sum, cycle) => sum + (cycle.durationCount || 0),
        0,
      );
      const totalContributed = cycles.reduce(
        (sum, cycle) => sum + (cycle.contributedUnits || 0),
        0,
      );
      if (totalExpected > 0) {
        consistencyScore = Math.round((totalContributed / totalExpected) * 100);
      }
    }

    return {
      currentStreak,
      totalSaved,
      completedCycles,
      monthlyGrowth,
      consistencyScore,
    };
  }, [cycles, transactions, monthlyData]);

  const chartData = monthlyData.length > 0 ? monthlyData : data;
  return (
    <div className="page-container">
      {/* =========================
          HEADER
      ========================== */}

      <div className="analytics-header glass-card">
        <div>
          <h1>Savings Analytics</h1>

          <p className="text-muted">
            Track your savings growth and financial consistency.
          </p>
        </div>
      </div>

      {/* =========================
          TOP STATS
      ========================== */}

      <div className="analytics-stats">
        {dashboardLoading ? (
          <>
            <SkeletonBlock width="100%" height="80px" />
            <SkeletonBlock width="100%" height="80px" />
            <SkeletonBlock width="100%" height="80px" />
            <SkeletonBlock width="100%" height="80px" />
          </>
        ) : cycles.length === 0 ? (
          <div className="analytics-empty-state">
            <EmptyState
              icon="📈"
              title="No analytics yet"
              subtitle="Start saving to see your financial growth and achievements."
            />
          </div>
        ) : (
          <>
            <div className="glass-card insight-card">
              <span>Current Streak</span>
              <h2>{analytics.currentStreak} Days</h2>
            </div>

            <div className="glass-card insight-card">
              <span>Total Saved</span>
              <h2>₦{analytics.totalSaved.toLocaleString()}</h2>
            </div>

            <div className="glass-card insight-card">
              <span>Completed Cycles</span>
              <h2>{analytics.completedCycles}</h2>
            </div>

            <div className="glass-card insight-card">
              <span>Monthly Growth</span>
              <h2>
                {analytics.monthlyGrowth > 0 ? "+" : ""}
                {analytics.monthlyGrowth}%
              </h2>
            </div>
          </>
        )}
      </div>

      {/* =========================
          CHART GRID
      ========================== */}

      <div className="analytics-grid">
        {/* =====================
            MAIN CHART
        ====================== */}

        <div className="glass-card chart-card">
          <div className="chart-top">
            <h2>Savings Growth</h2>

            <span>Last 6 Months</span>
          </div>

          <div className="chart-wrapper">
            {cyclesLoading ? (
              <SkeletonBlock width="100%" height="320px" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorSavings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />

                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="savings"
                    stroke="#16a34a"
                    fillOpacity={1}
                    fill="url(#colorSavings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* =====================
            SIDE INSIGHTS
        ====================== */}

        <div className="analytics-side">
          {/* CONSISTENCY */}

          <div className="glass-card consistency-card">
            <h3>Consistency Score</h3>

            <div className="score-circle">{analytics.consistencyScore}%</div>

            <p>
              {analytics.consistencyScore >= 90
                ? "Excellent savings discipline this month."
                : analytics.consistencyScore >= 70
                  ? "Good savings consistency."
                  : analytics.consistencyScore >= 50
                    ? "Keep up the momentum!"
                    : "Let's work on building consistency."}
            </p>
          </div>

          {/* ACHIEVEMENTS */}

          <div className="glass-card achievement-card">
            <h3>Achievements</h3>

            <div className="achievement-list">
              {analytics.currentStreak >= 20 && (
                <div className="achievement-item">🔥 20+ Day Streak</div>
              )}
              {analytics.completedCycles > 0 && (
                <div className="achievement-item">
                  🎯 {analytics.completedCycles} Cycle
                  {analytics.completedCycles > 1 ? "s" : ""} Completed
                </div>
              )}
              {analytics.totalSaved >= 100000 && (
                <div className="achievement-item">💰 ₦100k Milestone</div>
              )}
              {analytics.consistencyScore >= 80 && (
                <div className="achievement-item">🚀 Consistent Saver</div>
              )}
              {analytics.monthlyGrowth > 20 && (
                <div className="achievement-item">📈 High Growth Month</div>
              )}
              {analytics.currentStreak === 0 && cycles.length === 0 && (
                <div className="achievement-item">🌟 Ready to Start</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM SECTION
      ========================== */}

      <div className="analytics-bottom">
        {/* ACTIVITY */}

        <div className="glass-card activity-card">
          <div className="chart-top">
            <h2>Contribution Trend</h2>

            <span>Weekly Activity</span>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            {cyclesLoading ? (
              <SkeletonBlock width="100%" height="250px" />
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* INSIGHT */}

        <div className="glass-card smart-insight-card">
          <h2>Smart Insight</h2>

          {analytics.monthlyGrowth > 0 ? (
            <div className="smart-box">
              <h3>Growth Momentum</h3>
              <p>
                Your savings grew by {analytics.monthlyGrowth}% compared to last
                month.
                {analytics.monthlyGrowth > 20
                  ? " Excellent performance!"
                  : " Keep it up!"}
              </p>
            </div>
          ) : analytics.totalSaved > 0 ? (
            <div className="smart-box">
              <h3>Building Foundations</h3>
              <p>
                You've saved ₦{analytics.totalSaved.toLocaleString()} so far.
                {analytics.currentStreak > 0
                  ? ` Current streak: ${analytics.currentStreak} days.`
                  : " Start a streak today!"}
              </p>
            </div>
          ) : (
            <div className="smart-box">
              <h3>Ready to Begin</h3>
              <p>
                Your savings journey starts with the first contribution. Create
                a cycle and begin building wealth.
              </p>
            </div>
          )}

          {analytics.consistencyScore >= 70 && analytics.currentStreak > 0 && (
            <div className="smart-box">
              <h3>Consistency Champion</h3>
              <p>
                {analytics.consistencyScore}% consistency score with a{" "}
                {analytics.currentStreak}-day streak. You're building excellent
                financial habits!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
