import { signupApi } from "@/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
      });

      console.log("signup data: ", res.data);

      navigate("/otp-verify", { state: { email: formData.email, type: "signup" } });
    } catch (error) {
      console.error("signup error:", error);
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
