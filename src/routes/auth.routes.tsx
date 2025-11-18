import Login from '@/components/reusable/auth/Login'
import Signup from '@/components/reusable/auth/Signup' 
import ForgetPassword from '@/pages/auth/ForgetPassword'
import ResetPassword from '@/pages/auth/ResetPass'
import Otp from '@/components/reusable/auth/Otp'


import { Route, Routes } from 'react-router-dom'
import AuthProtectedRoute from './auth-protected.routes'

function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthProtectedRoute/>}>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/forgetPassword' element={<ForgetPassword/>} />
        <Route path='/resetPassword' element={<ResetPassword/>} />
        <Route path='/signup-otp-verify' element={<Otp/>} />
        <Route path='/forget-otp-verify' element={<Otp/>} />
        <Route path='/logout'/>
      </Route>
    </Routes>
  )
}

export default AuthRoutes