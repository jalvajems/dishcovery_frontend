import { signupApi, googleAuthApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { chefDashboardApi } from "@/api/chefApi";
import { userDashboardApi } from "@/api/foodieApi";
import type { AuthResponse } from "@/api/apiInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOtpStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";

export const useSignup = () => {
  const navigate = useNavigate();
  const { setOtpData } = useOtpStore();
  const { login } = useAuthStore();

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
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Login failed. Please try again.");
      showError(errorMessage)
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        showError("Google Signup failed");
        return;
      }

      if (!formData.role) {
        showError("Please select a role before signing up with Google.");
        return;
      }

      const { data } = await googleAuthApi({ credential: credentialResponse.credential, role: formData.role }) as { data: AuthResponse };

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

      if (data.user.role === 'chef') {
        try {
          await chefDashboardApi();
          showSuccess('Signup Successfully!!')
          navigate('/chef/dashboard');
        } catch (err: unknown) {
          showError(getErrorMessage(err, "Signup failed. Please try again."));
        }
      } else if (data.user.role === 'user') {
        try {
          await userDashboardApi();
          showSuccess('Signup Successfully!!')
          navigate('/foodie/dashboard');
        } catch (err: unknown) {
          showError(getErrorMessage(err, "Signup failed. Please try again."));
        }
      }
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Google Signup failed. Please try again."));
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    handleBackToLogin,
    handleSignUp,
    handleGoogleSuccess,
    handleInputChange,
    setAgreedToTerms,
    formData,
    agreedToTerms,
    errors,
  };
};
