import Login from '@/components/reusable/Login'
import Signup from '@/components/reusable/Signup'
import { Route, Routes } from 'react-router-dom'

function AuthRoutes() {
  return (
    <Routes>
        <Route path='/'  />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
    </Routes>
  )
}

export default AuthRoutes