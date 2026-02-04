import { loginApi } from "@/api/authApi";
import { chefDashboardApi } from "@/api/chefApi";
import { userDashboardApi } from "@/api/foodieApi";
import { useAuthStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {

  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({

    email: "",
    password: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err == "")

  }

  const handleLogin = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try {
      const { data } = await loginApi({ email: formData.email, password: formData.password });

      if (data.user.isBlocked) {
        showError('user is blocked!!')
        return;
      }

      // Map MongoDB _id to id for authStore
      const mappedUser = {
        id: (data.user as any)._id || data.user.id,
        _id: (data.user as any)._id || data.user.id, // Ensure _id is present
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      };

      login(data.accessToken, mappedUser);
      if (data.user.role == "admin") {
        showError("Access denied.");
        return;
      }
      if (data.user.role === 'chef') {
        try {
          await chefDashboardApi();
          showSuccess('Login Successfully!!')
          navigate('/chef/dashboard');
        } catch (err: any) {
          const message = err.response?.data?.message || "Login failed. Please try again.";

          showError(message);

        }
      } else if (data.user.role === 'user') {
        try {
          await userDashboardApi();
          showSuccess('Login Successfully!!')
          navigate('/foodie/dashboard');
        } catch (err: any) {
          const message =
            err.response?.data?.message || "Login failed. Please try again.";

          showError(message);

        }
      }
    } catch (error: any) {

      const message =
        error.response?.data?.message ||
        "Login failed. Please try again.";

      showError(message);
    }

  };


  const handleGoogleLogin = () => {
    alert('Google login initiated');
  };

  const handleForgotPassword = () => {
    navigate('/forgetPassword')
  };
  const handleBackSignup = () => {
    navigate('/signup')
  }

  return {
    formData,
    handleForgotPassword,
    handleGoogleLogin,
    handleInputChange,
    handleLogin,
    handleBackSignup,
    errors

  }
}