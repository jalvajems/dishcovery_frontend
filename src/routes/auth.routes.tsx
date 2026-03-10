import Login from '@/components/shared/auth/Login'
import Signup from '@/components/shared/auth/Signup'
import ForgetPassword from '@/pages/auth/ForgetPassword'
import ResetPassword from '@/pages/auth/ResetPass'
import Otp from '@/components/shared/auth/Otp'


import { Route, Routes } from 'react-router-dom'
import AuthProtectedRoute from './auth-protected.routes'
import AdminLogin from '@/components/shared/auth/AdminLogin'

function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthProtectedRoute />}>
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgetPassword' element={<ForgetPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/signup-otp-verify' element={<Otp />} />
        <Route path='/forget-otp-verify' element={<Otp />} />
        <Route path='/logout' />
      </Route>
    </Routes>
  )
}

export default AuthRoutes