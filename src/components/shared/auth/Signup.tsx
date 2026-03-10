import { useSignup } from "@/hooks/auth/useSignup";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/logo.png'


export default function Signup() {
  const navigate=useNavigate()
  const {
    agreedToTerms,
    formData,
    handleBackToLogin,
    handleGoogleSuccess,
    handleInputChange,
    handleSignUp,
    setAgreedToTerms,
    errors,
  } = useSignup();

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 border-b border-gray-200">
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
        <div className="flex items-center gap-2">
          <img alt="" className="h-14" />
        </div>
        <button
          onClick={handleBackToLogin}
          className="px-6 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
        >
          Login
        </button>
      </header>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">
            Join Dishcovery
          </h1>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-4 py-3 bg-green-50 border-none rounded-md text-green-700 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-3 bg-green-50 border-none rounded-md text-green-700 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-4 py-3 bg-green-50 border-none rounded-md text-green-700 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-green-50 border-none rounded-md text-green-700 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-green-50 border-none rounded-md text-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <option value="">Select your role</option>
                <option value="user">User</option>
                <option value="chef">Chef</option>
              </select>
            </div>


            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSignUp}
                className="flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={handleBackToLogin}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Login
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Google Signup Failed')}
                theme="outline"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
