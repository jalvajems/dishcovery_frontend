import { useEffect } from "react";
import { chefDashboardApi } from "@/api/chefApi";
import { Utensils, Star, Users, BookOpen, Calendar } from "lucide-react";

export default function ChefDashboard() {
  useEffect(() => {
    chefDashboardApi();
  }, []);
  

  // Dummy data (replace with API data later)
  const stats = [
    {
      label: "Total Recipes",
      value: 48,
      icon: Utensils,
      footer: "2 new this week",
    },
    {
      label: "Average Rating",
      value: "4.8",
      icon: Star,
      footer: "Based on 342 reviews",
    },
    {
      label: "Followers",
      value: "3.4k",
      icon: Users,
      footer: "120 new this week",
    },
    {
      label: "Workshops Hosted",
      value: 18,
      icon: BookOpen,
      footer: "Next workshop tomorrow",
    },
  ];

  const activities = [
    {
      title: "Uploaded a New Recipe",
      desc: "Spicy Butter Garlic Shrimp",
      time: "2 hours ago",
    },
    {
      title: "Received a Review",
      desc: "Your Italian Pasta has a new 5 star review",
      time: "5 hours ago",
    },
    {
      title: "New Workshop Registration",
      desc: "10 people enrolled",
      time: "1 day ago",
    },
  ];

  const recipes = [
    {
      name: "Creamy Garlic Chicken",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    },
    {
      name: "Veg Loaded Pizza",
      image:
        "https://images.unsplash.com/photo-1548365328-8b2f93d1d93e?w=400",
    },
    {
      name: "Thai Green Curry",
      image:
        "https://images.unsplash.com/photo-1604908177824-687d1f9ee866?w=400",
    },
    {
      name: "Sushi Special",
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
    },
  ];

  const workshops = [
    {
      title: "Masterclass: Italian Special",
      date: "Dec 20, 2025",
      attendees: 42,
      image:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400",
    },
    {
      title: "Asian Fusion Cooking",
      date: "Dec 26, 2025",
      attendees: 38,
      image:
        "https://images.unsplash.com/photo-1514516870926-205ce66d922d?w=400",
    },
  ];

  return (
    <main className="flex-1 p-8">

      {/* ------------------------------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------ */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
          alt="Featured Food"
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Welcome back, Chef Jems!
          </h1>
          <p className="text-gray-200 text-lg">
            Here’s your performance overview and recent activity.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ */}
      {/* STATS SECTION */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {stats.map((s, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-semibold">{s.label}</p>
              <s.icon className="w-7 h-7 text-green-600" />
            </div>

            <h3 className="text-4xl font-bold text-gray-900 mb-1">{s.value}</h3>
            <p className="text-gray-400 text-sm">{s.footer}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* ACTIVITIES */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        My Activities
      </h2>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {activities.map((a, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-bold mb-2">{a.title}</h3>
            <p className="text-gray-600">{a.desc}</p>
            <p className="text-sm text-gray-400 mt-3">{a.time}</p>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* RECENT RECIPES */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Recent Recipes
      </h2>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {recipes.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <img
              src={r.image}
              alt={r.name}
              className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg">{r.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* WORKSHOP OVERVIEW */}
      {/* ------------------------------------------------------ */}
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
        Workshop Overview
      </h2>

      <div className="space-y-6 mb-12">
        {workshops.map((w, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl flex items-center gap-5 shadow-md hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
          >
            <img
              src={w.image}
              alt={w.title}
              className="w-32 h-24 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h3 className="text-xl font-bold">{w.title}</h3>
              <p className="text-gray-600">Attendees: {w.attendees}</p>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5" />
              <span>{w.date}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
