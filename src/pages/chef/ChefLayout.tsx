import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ChefSidebar from "@/components/shared/chef/SideBar.chef";
import ChefNavbar from "@/components/shared/chef/NavBar.chef";
import Footer from "@/components/shared/chef/Footer";

export default function ChefLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <ChefNavbar />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-72 bg-white border-r shadow-lg z-40 overflow-y-auto">
          <ChefSidebar
            activePath={location.pathname}
            onMenuSelect={(path) => navigate(path)}
          />
        </div>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 ml-72 overflow-y-auto bg-gray-50 p-6 h-[calc(100vh-4rem)]">
          <Outlet />
          <Footer/>
        </main>
      </div>
    </div>
  );
}
