import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/auth.routes";
import UserRouter from "./routes/foodie.routes";
import AdminRoutes from "./routes/admin.routes";
import ChefRoutes from "./routes/chef.routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthRoutes />
      <UserRouter />
      <ChefRoutes />
      <AdminRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>

  )
}

export default App;