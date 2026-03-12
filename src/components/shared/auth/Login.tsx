import { useState } from 'react';
import { useLogin } from '@/hooks/auth/useLogin';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    handleInputChange,
    handleForgotPassword,
    handleGoogleSuccess,
    handleLogin,
    handleBackSignup,
    errors
  } = useLogin();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center font-sans overflow-hidden relative">
      
      {/* Background abstract elements */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
      />
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"
      />

      {/* Navbar Minimal */}
      <div className="absolute top-0 w-full p-6 lg:px-8 flex justify-between items-center z-50">
          <div
            onClick={() => navigate('/foodie/dashboard')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="Dishcovery"
              className="h-10 w-auto object-contain"
            />
          </div>
          <button
            onClick={handleBackSignup}
            className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-emerald-100 text-emerald-800 font-semibold rounded-full hover:bg-emerald-50 hover:shadow-md transition-all">
            Sign Up
          </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white mt-16"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-center"
          >
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-neutral-500 mt-2 text-sm">
              Log in to continue your culinary journey
            </p>
          </motion.div>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block mb-2 text-sm font-semibold text-neutral-700">Email or Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter email or username"
                className={`w-full pl-12 pr-4 py-3.5 bg-neutral-50 border ${errors.email ? 'border-red-300 ring-red-100' : 'border-neutral-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl outline-none focus:ring-4 transition-all duration-200 text-neutral-800 placeholder-neutral-400 font-medium`}
              />
            </div>
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.email}</motion.p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm font-semibold text-neutral-700">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 border ${errors.password ? 'border-red-300 ring-red-100' : 'border-neutral-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl outline-none focus:ring-4 transition-all duration-200 text-neutral-800 placeholder-neutral-400 font-medium tracking-wider`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-emerald-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.password}</motion.p>
            )}
            
            <div className="flex justify-end mt-2">
              <button
                onClick={handleForgotPassword}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-2"
          >
            <button
              onClick={handleLogin}
              className="w-full relative group flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
            >
              <span>Log in</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-neutral-400 font-medium">Or continue with</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center flex-col items-center"
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google Login Failed')}
              theme="outline"
              shape="rectangular"
              size="large"
            />
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}