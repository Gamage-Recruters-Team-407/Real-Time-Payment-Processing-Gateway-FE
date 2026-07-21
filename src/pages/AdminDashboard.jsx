// pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, trendRes, activityRes] = await Promise.all([
        api.get("/admin/dashboard/overview"),
        api.get("/admin/dashboard/transaction-trend?range=7d"),
        api.get("/admin/dashboard/recent-activity?limit=4"),
      ]);

      const overviewData = overviewRes.data?.data || overviewRes.data;
      const trendData = trendRes.data?.data || trendRes.data;
      const activityData = activityRes.data?.data || activityRes.data;

      setOverview(overviewData);
      setTrend(Array.isArray(trendData) ? trendData : []);
      setActivity(Array.isArray(activityData) ? activityData : []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
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
      <div className="flex-1 px-8 py-6 space-y-6">
        {error && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Overview</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time snapshot of payments, merchants, and platform health.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            dotColor="bg-emerald-500"
            label="Total revenue"
            value={formatCurrencyShort(data.revenue?.total || 0)}
            caption={`+${data.revenue?.todayChangePct ?? 0}% from last month`}
          />
          <StatCard
            dotColor="bg-emerald-500"
            label="Transactions today"
            value={formatNumber(data.transactions?.today || 0)}
            caption={`${data.transactions?.successRate ?? 0}% success rate`}
          />
          <StatCard
            dotColor="bg-amber-500"
            label="Merchants pending"
            value={formatNumber(data.merchants?.pendingApproval || 0)}
            caption="Awaiting verification"
          />
          <StatCard
            dotColor="bg-emerald-500"
            label="Active users"
            value={formatNumber(data.users?.total || 0)}
            caption={`+${data.users?.newThisWeek ?? 0} new this week`}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Transaction volume</p>
                <p className="text-xs text-slate-400">Last 7 days (LKR)</p>
              </div>
              <button 
                onClick={fetchDashboardData}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
            <div className="h-48">
              {trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend} barCategoryGap="30%">
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(15,23,42,0.04)" }}
                      formatter={(value) => {
                        const formatted = new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(value);
                        return [formatted, "Volume"];
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                      {trend.map((entry, index) => (
                        <Cell
                          key={entry.date || index}
                          fill={(entry.totalAmount || 0) / maxTrendValue > 0.55 ? "#10b981" : "#a7f3d0"}
                        />
                      ))}
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

          <div className="bg-white rounded-xl border border-slate-200 p-5">
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
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.tone}`}>
                        <Icon size={14} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 truncate font-medium">{item.title}</p>
                        <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.time}</span>
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

        <div>
          <p className="text-sm font-medium text-slate-800 mb-3">Quick access</p>
          <div className="grid grid-cols-3 gap-4">
            <QuickAccessCard 
              icon={UserCircle2}
              title="Merchant onboarding"
              subtitle="Merchant details"
            />
            <QuickAccessCard 
              icon={Wallet}
              title="Payment history"
              subtitle={`${formatNumber(data.transactions?.today || 0)} transactions today`}
            />
            <QuickAccessCard 
              icon={Users}
              title="Users"
              subtitle={`${formatNumber(data.users?.total || 0)} active accounts`}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ dotColor, label, value, caption }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{caption}</p>
    </div>
  );
}

function QuickAccessCard({ icon: Icon, title, subtitle }) {
  return (
    <button
      className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 text-left hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <span className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </button>
  );
}