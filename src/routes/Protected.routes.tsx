import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";



export default function ProtectedRoute(){
    const {token}=useAuthStore();

    console.log("tokenform Proteched",token)
   
    if(!token){
        console.log("THis is correcnly working")
        return <Navigate to='/login' replace />
    }

    return <Outlet/>;
}