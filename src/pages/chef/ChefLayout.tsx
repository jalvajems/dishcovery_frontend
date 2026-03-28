import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ChefSidebar from "@/components/shared/chef/SideBar.chef";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import Footer from "@/components/shared/chef/Footer";
import { useState } from "react";

export default function ChefLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Navbar - now fixed height and responsive */}
      <ChefNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative pt-16">
        {/* Sidebar with mobile drawer support */}
        <div 
          className={`
            fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:relative md:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            w-72 bg-white border-r shadow-xl md:shadow-none
          `}
        >
          <ChefSidebar
            activePath={location.pathname}
            onMenuSelect={(path) => {
              navigate(path);
              setIsSidebarOpen(false);
            }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 h-[calc(100vh-4rem)] scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            <Footer/>
          </div>
        </main>
      </div>
    </div>
  );
}
