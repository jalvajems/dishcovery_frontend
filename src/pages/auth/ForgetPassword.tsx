import { useForgetPass } from "@/hooks/auth/useForgetPass";
import logo from "../../assets/logo.png";


export default function ForgotPassword() {
    
    const {
        setEmail,
        email,
        handleLogIn,
        handleSendOTP
    }=useForgetPass()

  return (
    <div className="min-h-screen bg-white">
       {/* Header */}
      <header className="flex justify-between items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
         <img src={logo} alt="" className=' h-14'/>
        </div>
        <button 
        onClick={handleLogIn}
        className="px-6 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
          Login
        </button>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold text-center mb-3">Forgot your password?</h1>
          <p className="text-center text-gray-700 mb-8">Enter the email address</p>
          
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
            </div>

            {/* Send Reset OTP Button */}
            <button
              onClick={handleSendOTP}
              className="w-full px-6 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-600 transition-colors"
            >
              Send Reset OTP
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