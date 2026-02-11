// src/hooks/auth/useAdminLogin.ts
import { adminLoginApi, loginApi } from "@/api/authApi";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => val === "");
  };

  const handleAdminLogin = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await adminLoginApi({
        email: formData.email,
        password: formData.password,
      });

      if (data.user.role !== "admin") {
        showError("Access denied. Not an admin account.");
        return;
      }

      if (data.user.isBlocked) {
        showError("Admin account is blocked.");
        return;
      }

      login(data.accessToken, data.user);
      showSuccess("Admin Login Successful");
      navigate("/admin-dashboard");

    } catch (error: unknown) {
      const message = getErrorMessage(error, "Login failed. Please try again.");
      showError(message);
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleAdminLogin,
  };
};
