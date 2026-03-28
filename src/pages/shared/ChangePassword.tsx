import { useState } from 'react';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { motion } from "framer-motion";
import { Lock, Shield, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "../../assets/logo.png";

export default function ChangePassword() {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    const {
        formData,
        handleInputChange,
        handleBack,
        handleSubmit,
        errors
    } = useChangePassword();

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center font-sans overflow-hidden relative py-12">
            {/* Background abstract elements */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"
            />

            {/* Navbar Minimal */}
            <div className="fixed top-0 w-full p-6 lg:px-8 flex justify-between items-center z-50">
                <div onClick={handleBack} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Dishcovery" className="h-10 w-auto object-contain" />
                </div>
                <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-emerald-100 text-emerald-800 font-semibold rounded-full hover:bg-emerald-50 hover:shadow-md transition-all flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 border border-white mt-8"
            >
                <div className="flex flex-col items-center mb-8">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Change Password</h1>
                        <p className="text-neutral-500 mt-2 text-sm max-w-xs mx-auto">
                            Ensure your account stays secure by updating your password regularly.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-5">
                    {/* Current Password */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <label className="block mb-2 text-sm font-semibold text-neutral-700">Current Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Shield className={`h-5 w-5 ${errors.currentPassword ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
                            </div>
                            <input
                                type={showCurrentPass ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="••••••••"
                                className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 border ${errors.currentPassword ? 'border-red-300 ring-red-100' : 'border-neutral-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl outline-none focus:ring-4 transition-all duration-200 text-neutral-800 placeholder-neutral-400 font-medium tracking-wider`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-emerald-500 transition-colors"
                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                            >
                                {showCurrentPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.currentPassword}</motion.p>
                        )}
                    </motion.div>

                    {/* New Password */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <label className="block mb-2 text-sm font-semibold text-neutral-700">New Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className={`h-5 w-5 ${errors.newPassword ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
                            </div>
                            <input
                                type={showNewPass ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="••••••••"
                                className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 border ${errors.newPassword ? 'border-red-300 ring-red-100' : 'border-neutral-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl outline-none focus:ring-4 transition-all duration-200 text-neutral-800 placeholder-neutral-400 font-medium tracking-wider`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-emerald-500 transition-colors"
                                onClick={() => setShowNewPass(!showNewPass)}
                            >
                                {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.newPassword}</motion.p>
                        )}
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                        <label className="block mb-2 text-sm font-semibold text-neutral-700">Confirm New Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Shield className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-400' : 'text-neutral-400 group-focus-within:text-emerald-500'} transition-colors duration-200`} />
                            </div>
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="••••••••"
                                className={`w-full pl-12 pr-12 py-3.5 bg-neutral-50 border ${errors.confirmPassword ? 'border-red-300 ring-red-100' : 'border-neutral-200 focus:border-emerald-500 focus:ring-emerald-100'} rounded-2xl outline-none focus:ring-4 transition-all duration-200 text-neutral-800 placeholder-neutral-400 font-medium tracking-wider`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-emerald-500 transition-colors"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                            >
                                {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.confirmPassword}</motion.p>
                        )}
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="pt-4">
                        <button
                            onClick={handleSubmit}
                            className="w-full relative group flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        >
                            <span>Update Password</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
