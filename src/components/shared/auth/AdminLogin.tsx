import { useState } from "react";
import { useAdminLogin } from "@/hooks/auth/useAdminLogin";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/logo.png";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    formData,
    errors,
    handleInputChange,
    handleAdminLogin,
  } = useAdminLogin();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative overflow-hidden font-sans">
      
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white"
      >
        <div className="flex flex-col items-center mb-8">
          {/* Logo */}
          <motion.img 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={logo} 
            alt="Dishcovery Logo" 
            className="h-16 w-auto object-contain mb-6 drop-shadow-sm" 
          />
          
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="text-center"
          >
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-neutral-500 mt-2 text-sm">
              Sign in to manage the Dishcovery platform
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block mb-2 text-sm font-semibold text-neutral-700">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="admin@dishcovery.com"
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
            transition={{ delay: 0.5 }}
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
          </motion.div>

          {/* Login Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <button
              onClick={handleAdminLogin}
              className="w-full relative group flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-8 text-center"
        >
          <p className="text-xs text-neutral-400 font-medium">
            Secure admin connection • Dishcovery {new Date().getFullYear()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
