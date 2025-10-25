import { BrowserRouter } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";


const App: React.FC=()=> {
  return (
    <BrowserRouter>
        <AuthRoutes/>
    </BrowserRouter>
 
  )
}

export default App;