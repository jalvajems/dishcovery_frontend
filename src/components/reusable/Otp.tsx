import { useOtp } from '@/hooks/useOtp';

export default function Otp() {
    const{
        otp,
        inputRefs,
        handleChange,
        handleKeyDown,
        handleLogIn,
        handleVerify
    }=useOtp()
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-xl font-semibold">Dishcovery</span>
        </div>
        <button className="px-6 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
          Sign up
        </button>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-3">OTP verification</h1>
          <p className="text-center text-gray-700 mb-12">enter the for digit number that send to your email</p>
          
          <div className="space-y-6">
            {/* OTP Input Boxes */}
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
                  className="w-16 h-16 text-center text-2xl font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              className="w-full px-6 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              Verify
            </button>

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