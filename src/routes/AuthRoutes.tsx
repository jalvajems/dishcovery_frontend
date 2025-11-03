import Login from '@/components/reusable/Login'
import Signup from '@/components/reusable/Signup' 
import ForgetPassword from '@/components/reusable/ForgetPassword'
import ResetPassword from '@/components/reusable/ResetPass'
import Otp from '@/components/reusable/Otp'


import { Route, Routes } from 'react-router-dom'

function AuthRoutes() {
  return (
    <Routes>
        <Route path='/'  />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/forgetPassword' element={<ForgetPassword/>} />
        <Route path='/resetPassword' element={<ResetPassword/>} />
        <Route path='/otp-verify' element={<Otp/>} />
    </Routes>
  )
}

export default AuthRoutes