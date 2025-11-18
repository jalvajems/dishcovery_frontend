import { useState } from "react";

export default function DashboardContent() {
  const stats = [
    { label: "Total Users", value: "12,345", color: "from-violet-500 to-purple-600", bgColor: "bg-violet-50", iconColor: "text-violet-600" },
    { label: "Total Chefs", value: "567", color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { label: "Total Recipes", value: "8,901", color: "from-emerald-500 to-green-600", bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Total Workshops", value: "234", color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Total Donations", value: "$12,345", color: "from-rose-500 to-pink-600", bgColor: "bg-rose-50", iconColor: "text-rose-600" },
  ];

  const activityData = [
    { 
      title: "User growth", 
      percentage: "+15%", 
      change: "+15%", 
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"], 
      hasChart: true,
      color: "from-violet-500 to-purple-600"
    },
    { 
      title: "Recipe Submissions", 
      percentage: "+8%", 
      change: "+8%", 
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
      heights: [65, 75, 70, 80],
      color: "from-emerald-500 to-green-600"
    },
    { 
      title: "Blog Submissions", 
      percentage: "+9%", 
      change: "+8%", 
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
      heights: [70, 72, 68, 75],
      color: "from-blue-500 to-cyan-600"
    },
    { 
      title: "Workshop Submissions", 
      percentage: "+5%", 
      change: "+8%", 
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
      heights: [60, 65, 70, 68],
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-green-700 to-blue-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-5 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <div className={`w-6 h-6 ${stat.iconColor}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
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
          Activity Trends
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {activityData.map((activity, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{activity.title}</h3>
                  <p className={`text-4xl font-bold bg-gradient-to-r ${activity.color} bg-clip-text text-transparent mb-2`}>
                    {activity.percentage}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    Last 30 Days <span className="text-green-700">{activity.change}</span>
                  </p>
                </div>
              </div>

              {activity.hasChart ? (
                <div className="relative h-40">
                  <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`lineGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                      <linearGradient id={`areaGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 80 Q 50 40, 100 60 T 200 50 T 300 90 T 400 70 L 400 150 L 0 150 Z" 
                      fill={`url(#areaGradient${index})`}
                    />
                    <path 
                      d="M 0 80 Q 50 40, 100 60 T 200 50 T 300 90 T 400 70" 
                      fill="none" 
                      stroke={`url(#lineGradient${index})`}
                      strokeWidth="3"
                      className="drop-shadow-lg"
                    />
                  </svg>
                  <div className="flex justify-between mt-4">
                    {activity.weeks.map((week, i) => (
                      <span key={i} className="text-xs font-bold text-green-600">{week}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-end gap-3 h-32 bg-gradient-to-t from-gray-50 to-transparent rounded-xl p-4">
                    {activity.weeks.map((week, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                        <div 
                          className={`w-full bg-gradient-to-t ${activity.color} rounded-lg hover:opacity-80 transition-all duration-300 shadow-lg group-hover/bar:shadow-xl`}
                          // style={{ height: `${activity.heights[i]}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2">
                    {activity.weeks.map((week, i) => (
                      <span key={i} className="text-xs font-bold text-green-600">{week}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
