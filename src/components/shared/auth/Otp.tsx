import { useOtp } from '@/hooks/auth/useOtp';
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import logo from "../../../assets/logo.png";

export default function Otp() {
  const {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleLogIn,
    handleVerify,
    handleResendOtp,
    otpError,
    timer
  } = useOtp();

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
          <div onClick={handleLogIn} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img src={logo} alt="Dishcovery" className="h-10 w-auto object-contain" />
          </div>
          <button
              onClick={handleLogIn}
              className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-emerald-100 text-emerald-800 font-semibold rounded-full hover:bg-emerald-50 hover:shadow-md transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
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
                      <KeyRound className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Verify Email</h1>
                  <p className="text-neutral-500 mt-2 text-sm max-w-xs mx-auto">
                      Please enter the 4-digit code sent to your email address.
                  </p>
              </motion.div>
          </div>

          <div className="space-y-6">
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-4 mb-4"
              >
                  {otp.map((digit, index) => (
                      <motion.input
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          key={index}
                          ref={inputRefs[index] as any}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e as any)}
                          className={`w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold bg-neutral-50 border-2 rounded-2xl outline-none transition-all duration-200 shadow-sm
                          ${otpError ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 text-red-600' : 'border-neutral-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-neutral-800'}`}
                      />
                  ))}
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="pt-2">
                  <button
                      onClick={handleVerify as any}
                      className="w-full relative group flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                  >
                      <span>Verify Code</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center pt-2">
                  {timer > 0 ? (
                      <p className="text-sm font-medium text-neutral-500">
                          Resend code in <span className="text-emerald-600 font-bold">{timer}s</span>
                      </p>
                  ) : (
                      <p className="text-sm font-medium text-neutral-600">
                          Didn't receive the code?{' '}
                          <button onClick={handleResendOtp as any} className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold transition-colors">
                              Resend OTP
                          </button>
                      </p>
                  )}
              </motion.div>
          </div>
      </motion.div>
    </div>
  );
}