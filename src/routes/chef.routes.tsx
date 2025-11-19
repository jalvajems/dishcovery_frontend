import ChefDashboard from "@/pages/chef/ChefDashboard";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Protected.routes";
import { useAuthStore } from "@/store/authStore";
import Login from "@/components/shared/auth/Login";

function ChefRoutes(){
    const {role}=useAuthStore();
    return(
        <Routes>
            {/* <Route element={role=='chef'?<ProtectedRoute/>:<Login/>}> */}
            <Route path="/chef-dashboard" element={<ChefDashboard/>} />
            {/* </Route> */}
           
        </Routes>
    )
}

export default ChefRoutes;