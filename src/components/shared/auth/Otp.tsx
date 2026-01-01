import { useOtp } from '@/hooks/auth/useOtp';
// import logo from "@/assets/logo.png";


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
  } = useOtp()
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img alt="" className=' h-14' />
        </div>
        <button
          onClick={handleLogIn}
          className="px-6 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
          Login
        </button>
      </header>

      <main className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-3">OTP verification</h1>
          <p className="text-center text-gray-700 mb-12">enter the for digit number that send to your email</p>

          <div className="space-y-6">
            <div className="flex justify-center gap-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-16 h-16 text-center text-2xl font-semibold rounded-lg
      border 
      ${otpError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-300"}
      focus:outline-none`}
                />


              ))}
            </div>

            <button

              onClick={handleVerify}
              className="w-full px-6 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              Verify
            </button>
            <div className="text-center">
              <p className="text-gray-700">Didn’t receive OTP?</p>
              {timer > 0 ? (
                <p className="text-gray-500 font-medium">Resend OTP in {timer}s</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-green-600 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>


            {/* Log in Link */}
            <div className="text-center pt-4">
              <p className="text-green-600">
                Remember your password?{' '}
                <button onClick={handleLogIn} className="hover:underline font-medium">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}