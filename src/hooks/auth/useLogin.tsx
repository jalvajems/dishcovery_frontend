import { loginApi, googleAuthApi } from "@/api/authApi";
import { chefDashboardApi } from "@/api/chefApi";
import { userDashboardApi } from "@/api/foodieApi";
import { useAuthStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "@/api/apiInstance";

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
      const { data } = await loginApi({ email: formData.email, password: formData.password }) as { data: AuthResponse };

      if (data.user.isBlocked) {
        showError('user is blocked!!')
        return;
      }
      const mappedUser = {
        id: data.user._id || data.user.id || '',
        _id: data.user._id || data.user.id || '',
        name: data.user.name,
        email: data.user.email,
        role: data.user.role as 'user' | 'chef' | 'admin'
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
        } catch (err: unknown) {
          const message = getErrorMessage(err, "Login failed. Please try again.");
          showError(message);
        }
      } else if (data.user.role === 'user') {
        try {
          await userDashboardApi();
          showSuccess('Login Successfully!!')
          navigate('/foodie/dashboard');
        } catch (err: unknown) {
          const message = getErrorMessage(err, "Login failed. Please try again.");
          showError(message);
        }
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Login failed. Please try again.");
      showError(message);
    }

  };


  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        showError("Google login failed");
        return;
      }

      const { data } = await googleAuthApi({ credential: credentialResponse.credential, role: 'user' }) as { data: AuthResponse };

      if (data.user.isBlocked) {
        showError('user is blocked!!')
        return;
      }
      const mappedUser = {
        id: data.user._id || data.user.id || '',
        _id: data.user._id || data.user.id || '',
        name: data.user.name,
        email: data.user.email,
        role: data.user.role as 'user' | 'chef' | 'admin'
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
        } catch (err: unknown) {
          const message = getErrorMessage(err, "Login failed. Please try again.");
          showError(message);
        }
      } else if (data.user.role === 'user') {
        try {
          await userDashboardApi();
          showSuccess('Login Successfully!!')
          navigate('/foodie/dashboard');
        } catch (err: unknown) {
          const message = getErrorMessage(err, "Login failed. Please try again.");
          showError(message);
        }
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Google Login failed. Please try again.");
      showError(message);
    }
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
    handleGoogleSuccess,
    handleInputChange,
    handleLogin,
    handleBackSignup,
    errors

  }
}