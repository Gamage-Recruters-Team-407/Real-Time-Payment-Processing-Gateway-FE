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
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";

const ACTIVITY_ICON_MAP = {
  approval: { icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  flag: { icon: AlertTriangle, tone: "text-amber-600 bg-amber-50" },
  invite: { icon: UserPlus, tone: "text-blue-600 bg-blue-50" },
  settlement: { icon: BadgeCheck, tone: "text-emerald-600 bg-emerald-50" },
};

const DEMO_OVERVIEW = {
  revenue: { total: 1240000, todayChangePct: 12.5 },
  transactions: { today: 2401, successRate: 99.2 },
  merchants: { pendingApproval: 7 },
  users: { total: 312, newThisWeek: 8 },
};

const DEMO_TREND = [
  { date: "Mon", totalAmount: 62 },
  { date: "Tue", totalAmount: 58 },
  { date: "Wed", totalAmount: 22 },
  { date: "Thu", totalAmount: 78 },
  { date: "Fri", totalAmount: 66 },
  { date: "Sat", totalAmount: 18 },
  { date: "Sun", totalAmount: 20 },
];

const DEMO_ACTIVITY = [
  { id: 1, type: "approval", title: "Lanka Fresh Grocers approved", subtitle: "Merchant onboarding", time: "2h ago" },
  { id: 2, type: "flag", title: "TXN-98214295 flagged", subtitle: "Wire transfer, Cayman Islands", time: "5h ago" },
  { id: 3, type: "invite", title: "K. Fernando invited", subtitle: "Lanka Fresh Grocers, owner", time: "1d ago" },
  { id: 4, type: "settlement", title: "Settlement batch STL-2026-08841 completed", subtitle: "312 transactions, LKR 4.7M", time: "1d ago" },
];

const QUICK_ACCESS = [
  { icon: UserCircle2, title: "Merchant onboarding", subtitle: "Merchant details" },
  { icon: Wallet, title: "Payment history", subtitle: "2,401 transactions today" },
  { icon: Users, title: "Users", subtitle: "312 active accounts" },
];

const formatCurrencyShort = (value) => {
  if (value >= 1000000) return `LKR ${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `LKR ${(value / 1000).toFixed(1)}K`;
  return `LKR ${value}`;
};

const formatNumber = (value) => new Intl.NumberFormat("en-LK").format(value);

export default function AdminDashboard() {
  const [overview, setOverview] = useState(DEMO_OVERVIEW);
  const [trend, setTrend] = useState(DEMO_TREND);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);
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

      if (overviewRes?.data?.data) setOverview(overviewRes.data.data);
      if (trendRes?.data?.data?.length) setTrend(trendRes.data.data);
      if (activityRes?.data?.data?.length) setActivity(activityRes.data.data);
    } catch {
      setError("Live data unavailable — showing cached snapshot.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchDashboardData();
    })();
  }, [fetchDashboardData]);

  const maxTrendValue = Math.max(...trend.map((t) => t.totalAmount), 1);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      {/* Navbar - Top */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar - Left */}
        <Sidebar />

        {/* Main Content - Right */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-8 py-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Header */}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Overview</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">
                Real-time snapshot of payments, merchants, and platform health.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                dotColor="bg-emerald-500"
                label="Total revenue"
                value={formatCurrencyShort(overview.revenue?.total || 0)}
                caption={`+${overview.revenue?.todayChangePct ?? 12.5}% from last month`}
              />
              <StatCard
                dotColor="bg-emerald-500"
                label="Transactions today"
                value={formatNumber(overview.transactions?.today || 0)}
                caption={`${overview.transactions?.successRate ?? 99.2}% success rate`}
              />
              <StatCard
                dotColor="bg-amber-500"
                label="Merchants pending"
                value={formatNumber(overview.merchants?.pendingApproval || 0)}
                caption="Awaiting verification"
              />
              <StatCard
                dotColor="bg-emerald-500"
                label="Active users"
                value={formatNumber(overview.users?.total || 0)}
                caption={`+${overview.users?.newThisWeek ?? 8} new this week`}
              />
            </div>

            {/* Charts and Activity */}
            <div className="grid grid-cols-3 gap-4">
              {/* Chart */}
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Transaction volume</p>
                    <p className="text-xs text-slate-400">Last 7 days, LKR millions</p>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend} barCategoryGap="30%">
                      <XAxis
                        dataKey="date"
                        tickFormatter={(v, i) => {
                          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                          return days[i] || v;
                        }}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(15,23,42,0.04)" }}
                        formatter={(value) => [`LKR ${value}M`, "Volume"]}
                      />
                      <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
                        {trend.map((entry, index) => (
                          <Cell
                            key={entry.date || index}
                            fill={entry.totalAmount / maxTrendValue > 0.55 ? "#10b981" : "#a7f3d0"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
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
                  {activity.map((item) => {
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
                  })}
                </ul>
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <p className="text-sm font-medium text-slate-800 mb-3">Quick access</p>
              <div className="grid grid-cols-3 gap-4">
                {QUICK_ACCESS.map(({ icon: Icon, title, subtitle }) => (
                  <button
                    key={title}
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
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
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