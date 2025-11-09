import Login from '@/components/reusable/Login'
import Signup from '@/components/reusable/Signup' 
import ForgetPassword from '@/pages/auth/ForgetPassword'
import ResetPassword from '@/pages/auth/ResetPass'
import Otp from '@/components/reusable/Otp'


import { Route, Routes } from 'react-router-dom'
import Home from '@/pages/Home'

function AuthRoutes() {
  return (
    <Routes>
        <Route path='/home'  element={<Home/>}/>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/forgetPassword' element={<ForgetPassword/>} />
        <Route path='/resetPassword' element={<ResetPassword/>} />
        <Route path='/otp-verify' element={<Otp/>} />
    </Routes>
  )
}

export default AuthRoutes