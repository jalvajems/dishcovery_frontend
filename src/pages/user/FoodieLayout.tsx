import FoodieHeader from "@/components/shared/foodie/Navbar.foodie";
import FoodieSidebar from "@/components/shared/foodie/Sidebar.foodie";
import Footer from "@/components/shared/chef/Footer";
import { Outlet } from "react-router-dom";

export default function FoodieLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <FoodieHeader />
      
      <div className="flex max-w-7xl mx-auto">
        <FoodieSidebar />
        
        <main className="flex-1 p-8">
          <Outlet />   {/* Dynamic page content */}
          < Footer/>
        </main>
      </div>
    </div>
  );
}
