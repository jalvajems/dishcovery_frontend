import { useEffect, useState } from "react";
import { adminGetDashboardStatsApi, adminGetGrowthDataApi } from "@/api/adminApi";

interface DashboardStats {
  totalUsers: number;
  totalChefs: number;
  totalRecipes: number;
  totalWorkshops: number;
  totalFoodSpots: number;
}

interface GrowthDataItem {
  week: string;
  count: number;
}

interface GrowthData {
  recipeGrowth: GrowthDataItem[];
  workshopGrowth: GrowthDataItem[];
  foodSpotGrowth: GrowthDataItem[];
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, growthResponse] = await Promise.all([
          adminGetDashboardStatsApi(),
          adminGetGrowthDataApi()
        ]);

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        if (growthResponse.data.success) {
          setGrowthData(growthResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const statsCards = stats ? [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), color: "from-violet-500 to-purple-600", bgColor: "bg-violet-50", iconColor: "text-violet-600" },
    { label: "Total Chefs", value: stats.totalChefs.toLocaleString(), color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Recipes", value: stats.totalRecipes.toLocaleString(), color: "from-emerald-500 to-green-600", bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Total Workshops", value: stats.totalWorkshops.toLocaleString(), color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Total Food Spots", value: stats.totalFoodSpots.toLocaleString(), color: "from-rose-500 to-pink-600", bgColor: "bg-rose-50", iconColor: "text-rose-600" },
  ] : [];

  const activityData = growthData ? [
    {
      title: "Recipe Uploads",
      data: growthData.recipeGrowth,
      color: "from-emerald-500 to-green-600",
      lineColor: "#10b981", // emerald-500
      gradientId: "recipeGradient"
    },
    {
      title: "Workshops Conducted",
      data: growthData.workshopGrowth,
      color: "from-amber-500 to-orange-600",
      lineColor: "#f59e0b", // amber-500
      gradientId: "workshopGradient"
    },
    {
      title: "Food Spots Uploaded",
      data: growthData.foodSpotGrowth,
      color: "from-rose-500 to-pink-600",
      lineColor: "#f43f5e", // rose-500
      gradientId: "foodSpotGradient"
    }
  ] : [];

  const calculatePercentage = (data: GrowthDataItem[]) => {
    if (data.length < 2) return "+0%";
    const lastWeek = data[data.length - 1].count;
    const previousWeek = data[data.length - 2].count;
    if (previousWeek === 0) return lastWeek > 0 ? "+100%" : "0%";
    const percentage = ((lastWeek - previousWeek) / previousWeek) * 100;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getMaxCount = (data: GrowthDataItem[]) => {
    return Math.max(...data.map(item => item.count), 1); // Ensure max is at least 1
  };

  // Helper to generate smooth SVG path
  const getPath = (data: GrowthDataItem[], max: number, width: number, height: number): { d: string; points: { x: number; y: number; count: number }[] } => {
    if (data.length === 0) return { d: "", points: [] };

    // Calculate points
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (item.count / max) * height * 0.8 - 10; // Reserve some padding at bottom and top
      return { x, y, count: item.count };
    });

    // Generate path command (simple smoothing)
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for bezier curve (approximation for smooth curve)
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    return { d, points };
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-green-700 to-blue-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-5 mb-12">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`w-6 h-6 ${stat.iconColor}`}>
                  {stat.label === "Total Users" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {stat.label === "Total Chefs" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                      <line x1="6" y1="17" x2="18" y2="17" />
                    </svg>
                  )}
                  {stat.label === "Total Recipes" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                  {stat.label === "Total Workshops" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                  {stat.label === "Total Food Spots" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">{stat.label}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Trends */}
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
          Growth Trends
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {activityData.map((activity, index) => {
            const maxCount = getMaxCount(activity.data);
            const percentage = calculatePercentage(activity.data);
            const chartHeight = 150;
            const chartWidth = 300; // Arbitrary coordinate system
            const { d, points } = getPath(activity.data, maxCount, chartWidth, chartHeight);

            // Create area path by closing the line path
            const areaPath = d ? `${d} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z` : "";

            return (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-4xl font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`}>
                        {percentage}
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        Last 4 Weeks
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-40 w-full">
                  {/* Tooltip-like values on top of points */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {points.map((p, i) => (
                      <div
                        key={i}
                        className="absolute transform -translate-x-1/2 -translate-y-full pb-2 transition-all duration-300"
                        style={{ left: `${(p.x / chartWidth) * 100}%`, top: `${(p.y / chartHeight) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-gray-600 bg-white/80 px-1 rounded shadow-sm">
                          {p.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={activity.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={activity.lineColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={activity.lineColor} stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Area under the curve */}
                    <path d={areaPath} fill={`url(#${activity.gradientId})`} />

                    {/* Line */}
                    <path d={d} fill="none" stroke={activity.lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points */}
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={activity.lineColor} strokeWidth="2" className="group-hover:scale-125 transition-transform duration-300" />
                    ))}
                  </svg>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between mt-2 px-1">
                    {activity.data.map((weekData, i) => (
                      <span key={i} className="text-xs font-medium text-gray-400">{weekData.week}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
