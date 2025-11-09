import { useResetPass } from '@/hooks/useResetPass';
import logo from "../../assets/logo.png";


export default function ResetPassword() {

    const{
        formData,
        handleInputChange,
        handleLogIn,
        handleSubmit
    }=useResetPass()

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
          <h1 className="text-4xl font-bold text-center mb-3">Reset Password</h1>
          <p className="text-center text-gray-700 mb-8">enter the for digit number that send to your email</p>
          
          <div className="space-y-4">
            {/* New Password Input */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                New password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="enter new password"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full px-4 py-4 bg-green-50 border border-green-100 rounded-xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition-colors"
              >
                Submit
              </button>
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