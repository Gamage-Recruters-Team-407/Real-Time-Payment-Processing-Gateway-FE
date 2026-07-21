// pages/AdminDashboard.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  UserCircle2,
  Users,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  BadgeCheck,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTransactions } from "../services/transactionService";

const ACTIVITY_ICON_MAP = {
  approval: { icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  flag: { icon: AlertTriangle, tone: "text-amber-600 bg-amber-50" },
  invite: { icon: UserPlus, tone: "text-blue-600 bg-blue-50" },
  settlement: { icon: BadgeCheck, tone: "text-emerald-600 bg-emerald-50" },
};

const formatCurrencyShort = (value) => {
  if (value >= 1000000) return `LKR ${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `LKR ${(value / 1000).toFixed(1)}K`;
  return `LKR ${value}`;
};

const formatNumber = (value) => new Intl.NumberFormat("en-LK").format(value);

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [activity, setActivity] = useState([]);
  const [todaysTransactions, setTodaysTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const todaysTransactionCount = useMemo(() => {
    return todaysTransactions.length;
  }, [todaysTransactions]);

  const todaysSuccessRate = useMemo(() => {
    if (todaysTransactions.length === 0) return 0;
    const successful = todaysTransactions.filter(t => t.status === "Successful").length;
    return Math.round((successful / todaysTransactions.length) * 100);
  }, [todaysTransactions]);

  const todaysTotal = useMemo(() => {
    return todaysTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [todaysTransactions]);

  const trendWithLabels = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return trend.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('en-LK', { 
        month: 'short', 
        day: 'numeric' 
      }),
      isToday: item.date === today
    }));
  }, [trend]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [overviewRes, trendRes, activityRes, transactionsRes] = await Promise.all([
        api.get("/admin/dashboard/overview"),
        api.get("/admin/dashboard/transaction-trend?range=7d"),
        api.get("/admin/dashboard/recent-activity?limit=4"),
        getTransactions({
          startDate: today,
          endDate: today,
          limit: 100
        })
      ]);

      const overviewData = overviewRes.data?.data || overviewRes.data;
      const trendData = trendRes.data?.data || trendRes.data;
      const activityData = activityRes.data?.data || activityRes.data;
      const transactionsData = transactionsRes.transactions || [];

      setOverview(overviewData);
      setTrend(Array.isArray(trendData) ? trendData : []);
      setActivity(Array.isArray(activityData) ? activityData : []);
      setTodaysTransactions(transactionsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  const maxTrendValue = Math.max(...trend.map((t) => t.totalAmount || 0), 1);

  const defaultOverview = {
    revenue: { total: 0, todayChangePct: 0 },
    transactions: { today: 0, successRate: 0 },
    merchants: { pendingApproval: 0 },
    users: { total: 0, newThisWeek: 0 },
  };

  const data = overview || defaultOverview;

  return (
    <DashboardLayout>
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Overview</p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-1">
            <span>Real-time snapshot of payments, merchants, and platform health.</span>
            {lastUpdated && (
              <span className="text-xs text-slate-400 whitespace-nowrap">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {/* Responsive Stats Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            dotColor="bg-emerald-500"
            label="Total revenue"
            value={formatCurrencyShort(data.revenue?.total || 0)}
            caption={`+${data.revenue?.todayChangePct ?? 0}% from last month`}
          />
          <StatCard
            dotColor="bg-blue-500"
            label="Transactions today"
            value={formatNumber(todaysTransactionCount)}
            caption={`${todaysSuccessRate}% success rate`}
          />
          <StatCard
            dotColor="bg-emerald-500"
            label="Daily total"
            value={formatCurrencyShort(todaysTotal)}
            caption={`${todaysTransactionCount} transaction${todaysTransactionCount !== 1 ? 's' : ''} today`}
          />
          <StatCard
            dotColor="bg-purple-500"
            label="Active users"
            value={formatNumber(data.users?.total || 0)}
            caption={`+${data.users?.newThisWeek ?? 0} new this week`}
          />
        </div>

        {/* Responsive Chart & Activity - Stack on mobile, side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart - Full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <p className="text-sm font-medium text-slate-800">Transaction volume</p>
                <p className="text-xs text-slate-400">Last 7 days (LKR)</p>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition self-start sm:self-auto"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
            <div className="h-40 sm:h-48 w-full">
              {trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendWithLabels} barCategoryGap="30%">
                    <XAxis
                      dataKey="displayDate"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(16,185,129,0.08)" }}
                      formatter={(value) => {
                        const formatted = new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(value);
                        return [formatted, "Volume"];
                      }}
                      labelFormatter={(label, items) => {
                        const item = items[0]?.payload;
                        return `Date: ${item?.date || label}`;
                      }}
                    />
                    <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                      {trendWithLabels.map((entry, index) => {
                        const isToday = entry.isToday;
                        const value = entry.totalAmount || 0;
                        
                        const ratio = maxTrendValue > 0 ? value / maxTrendValue : 0;
                        
                        let color;
                        if (isToday) {
                          color = "#059669";
                        } else if (value === 0) {
                          color = "#d1fae5";
                        } else {
                          if (ratio > 0.7) {
                            color = "#047857";
                          } else if (ratio > 0.4) {
                            color = "#10b981";
                          } else {
                            color = "#6ee7b7";
                          }
                        }
                        
                        return (
                          <Cell
                            key={entry.date || index}
                            fill={color}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  No transaction data available
                </div>
              )}
            </div>
          </div>

          {/* Activity - Full width on mobile, 1 column on desktop */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Recent activity</p>
                <p className="text-xs text-slate-400">Across the platform</p>
              </div>
              <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition">
                View all
              </button>
            </div>
            <ul className="space-y-4">
              {activity.length > 0 ? (
                activity.map((item) => {
                  const cfg = ACTIVITY_ICON_MAP[item.type] || ACTIVITY_ICON_MAP.approval;
                  const Icon = cfg.icon;
                  return (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.tone}`}>
                        <Icon size={13} className="sm:text-[14px]" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-slate-800 truncate font-medium">{item.title}</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-sm text-slate-400 text-center py-4">
                  No recent activity
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Responsive Transactions Table - Horizontal scroll on mobile */}
        {todaysTransactions.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Today's Transactions</p>
                <p className="text-xs text-slate-400">Recent transactions from today</p>
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] sm:min-w-full px-4 sm:px-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-slate-500 font-medium">ID</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Customer</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Amount</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Status</th>
                      <th className="text-left py-2 text-slate-500 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysTransactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction._id} className="border-b border-slate-100">
                        <td className="py-2 text-slate-700 font-mono text-[10px] sm:text-xs">{transaction.transactionId}</td>
                        <td className="py-2 text-slate-700 text-xs sm:text-sm">{transaction.customerName}</td>
                        <td className="py-2 text-slate-700 text-xs sm:text-sm">{formatCurrencyShort(transaction.amount)}</td>
                        <td className="py-2">
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                            transaction.status === "Successful" ? "bg-emerald-100 text-emerald-700" :
                            transaction.status === "Failed" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-2 text-slate-500 text-[10px] sm:text-xs">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ dotColor, label, value, caption }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className="truncate">{label}</span>
      </div>
      <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1 truncate">{value}</p>
      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium truncate">{caption}</p>
    </div>
  );
}