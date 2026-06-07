"use client";

import { useEffect, useState } from "react";
import {
  FileText, FolderOpen, Handshake, Eye, Globe, TrendingUp,
  Users, BarChart2, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

type Stats = {
  blogs: { total: number; published: number; draft: number };
  projects: { total: number };
  partners: { total: number; active: number };
  donations: { count: number; total: number };
  analytics: { totalViews: number; last30Days: number };
};

type AnalyticsData = {
  totalViews: number;
  last30Days: number;
  last7Days: number;
  countries: { country: string; count: number }[];
  topPages: { path: string; count: number }[];
  dailyViews: { date: string; count: number }[];
};

const COUNTRY_FLAGS: Record<string, string> = {
  "Malawi": "🇲🇼", "United States": "🇺🇸", "United Kingdom": "🇬🇧",
  "South Africa": "🇿🇦", "Kenya": "🇰🇪", "Tanzania": "🇹🇿",
  "Zimbabwe": "🇿🇼", "Zambia": "🇿🇲", "Germany": "🇩🇪",
  "France": "🇫🇷", "Canada": "🇨🇦", "Australia": "🇦🇺",
  "Netherlands": "🇳🇱", "Sweden": "🇸🇪", "Norway": "🇳🇴",
  "India": "🇮🇳", "China": "🇨🇳", "Japan": "🇯🇵",
};

function getFlag(country: string) {
  return COUNTRY_FLAGS[country] || "🌍";
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/analytics/stats"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Published Blogs",
      value: stats?.blogs.published ?? 0,
      sub: `${stats?.blogs.draft ?? 0} drafts`,
      icon: FileText,
      color: "bg-blue-50 text-blue-700",
      href: "/admin/blogs",
    },
    {
      label: "Projects",
      value: stats?.projects.total ?? 0,
      sub: "Active projects",
      icon: FolderOpen,
      color: "bg-purple-50 text-purple-700",
      href: "/admin/projects",
    },
    {
      label: "Active Partners",
      value: stats?.partners.active ?? 0,
      sub: `${stats?.partners.total ?? 0} total`,
      icon: Handshake,
      color: "bg-green-50 text-green-700",
      href: "/admin/partners",
    },
    {
      label: "Page Views (30d)",
      value: formatNumber(stats?.analytics.last30Days ?? 0),
      sub: `${formatNumber(stats?.analytics.totalViews ?? 0)} all time`,
      icon: Eye,
      color: "bg-orange-50 text-orange-700",
      href: "#analytics",
    },
  ];

  // Format daily chart data for recharts
  const chartData = (analytics?.dailyViews ?? []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    views: d.count,
  }));

  const maxViews = Math.max(...(analytics?.countries.map((c) => c.count) ?? [1]));

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.label}
              href={card.href}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-3xl font-black text-gray-900">{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-gray-600">{card.label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{card.sub}</p>
            </a>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div id="analytics" className="space-y-5">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-green-700" />
          <h2 className="text-lg font-black text-gray-900">Website Analytics</h2>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Live</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* 30-day chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Daily Visitors</p>
                <p className="text-2xl font-black text-gray-900">
                  {formatNumber(analytics?.last30Days ?? 0)}
                  <span className="text-sm font-medium text-gray-400 ml-1">last 30 days</span>
                </p>
              </div>
              <TrendingUp size={20} className="text-green-600" />
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "#f0fdf4" }}
                  />
                  <Bar dataKey="views" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                No visit data yet — check back after your first visitors arrive.
              </div>
            )}
          </div>

          {/* Visitor stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <p className="text-sm font-semibold text-gray-500">Quick Stats</p>
            <div className="space-y-3">
              {[
                { label: "All-time views", value: formatNumber(analytics?.totalViews ?? 0), icon: Eye },
                { label: "Last 30 days", value: formatNumber(analytics?.last30Days ?? 0), icon: TrendingUp },
                { label: "Last 7 days", value: formatNumber(analytics?.last7Days ?? 0), icon: BarChart2 },
                { label: "Countries reached", value: analytics?.countries.length ?? 0, icon: Globe },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Icon size={15} className="text-gray-400" />
                      {s.label}
                    </div>
                    <span className="font-black text-gray-900">{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Country breakdown + Top pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Countries */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe size={16} className="text-green-700" />
              <p className="text-sm font-black text-gray-900">Visitors by Country</p>
            </div>
            {analytics?.countries.length ? (
              <div className="space-y-3">
                {analytics.countries.map((c, i) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center">{getFlag(c.country)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700 truncate">{c.country}</span>
                        <span className="text-sm font-black text-gray-900 ml-2">{c.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${(c.count / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                    {i === 0 && <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded">Top</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No visitor data yet</p>
            )}
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} className="text-green-700" />
              <p className="text-sm font-black text-gray-900">Top Pages</p>
            </div>
            {analytics?.topPages.length ? (
              <div className="space-y-3">
                {analytics.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                      <code className="text-xs text-gray-700 font-mono truncate max-w-[180px]">{p.path || "/"}</code>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <Eye size={12} className="text-gray-400" />
                      <span className="text-sm font-black text-gray-900">{p.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No page data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}