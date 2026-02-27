import { useLogin } from '@/hooks/auth/useLogin';

export default function Login() {

  const {
    formData,
    handleInputChange,
    handleForgotPassword,
    handleLogin,
    handleBackSignup,
    errors
  } = useLogin();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img alt="" className=' h-14' />
        </div>
        <button
          onClick={handleBackSignup}
          className="px-6 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
          Sign Up
        </button>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome back</h1>

          <div className="space-y-4">
            {/* Email or Username Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email or Username
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email or username"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Log in Button */}
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Log in
            </button>


            {/* Sign up Links */}
            <div className="text-center pt-2">
              <p className="text-sm text-green-600">
                Don't have an account?{' '}
                <button className="hover:underline font-medium">
                  Sign up as a user
                </button>
                {' '}or{' '}
                <button className="hover:underline font-medium">
                  sign up as a chef
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}