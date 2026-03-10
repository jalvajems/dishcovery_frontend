import UserDashboard from '@/pages/user/UserDashboard'
import { Route, Routes } from 'react-router-dom'

function UserRouter(){
    return (
        <Routes >
            <Route path='/foodie-dashboard'  element={<UserDashboard/>}/>
        </Routes>
    )
}

export default UserRouter;