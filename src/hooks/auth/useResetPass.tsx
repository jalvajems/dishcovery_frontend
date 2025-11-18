import { resetPassApi } from "@/api/authApi";
import { useOtpStore } from "@/store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useResetPass = () => {
  const { email } = useOtpStore()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));

  };
  const validate = () => {
    let tempErrors: any = {};

    if (!formData.newPassword.trim()) {
      tempErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      tempErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.newPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };


  const handleSubmit = async () => {
    try {
      if (!validate()) return;

      await resetPassApi({ email: email, newPass: formData.newPassword, confirmPass: formData.confirmPassword })
      navigate('/login')
    } catch (error) {

    }
  };

  const handleLogIn = () => {
    navigate('/login')
  };

  return {
    formData,
    handleInputChange,
    handleLogIn,
    handleSubmit,
    setFormData,
    errors
  }
}