import { signupApi } from "@/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOtpStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";

export const useSignup = () => {
  const navigate = useNavigate();
  const { setOtpData } = useOtpStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Role is required!"

    if (!agreedToTerms)
      newErrors.terms = "You must agree to the Terms & Conditions";

    setErrors(newErrors);


    return Object.values(newErrors).every((err) => err === "");
  };


  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const res = await signupApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPass: formData.confirmPassword,
        role: formData.role
      });

      setOtpData(formData.email, 'signup')
      showSuccess(res.data.message)
      navigate("/signup-otp-verify");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        "Login failed. Please try again.";
      showError(errorMessage)
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    handleBackToLogin,
    handleSignUp,
    handleInputChange,
    setAgreedToTerms,
    formData,
    agreedToTerms,
    errors,
  };
};
