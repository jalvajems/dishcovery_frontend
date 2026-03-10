import { useAdminLogin } from "@/hooks/auth/useAdminLogin";

export default function AdminLogin() {
  const {
    formData,
    errors,
    handleInputChange,
    handleAdminLogin,
  } = useAdminLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Admin Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          {errors.email && (
            <p className="text-red-500 text-sm mb-1">{errors.email}</p>
          )}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter admin email"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          {errors.password && (
            <p className="text-red-500 text-sm mb-1">{errors.password}</p>
          )}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleAdminLogin}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
        >
          Log In
        </button>

      </div>
    </div>
  );
}
