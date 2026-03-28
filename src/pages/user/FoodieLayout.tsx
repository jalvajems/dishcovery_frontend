import FoodieHeader from "@/components/shared/foodie/Navbar.foodie";
import FoodieSidebar from "@/components/shared/foodie/Sidebar.foodie";
import Footer from "@/components/shared/chef/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function FoodieLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex flex-col">
      <FoodieHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative pt-16 md:pt-20">
        {/* Sidebar with mobile drawer support */}
        <div 
          className={`
            fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:relative md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:block
          `}
        >
          <FoodieSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden">
          <Outlet />   {/* Dynamic page content */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
