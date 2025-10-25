import { useState } from "react";

export const useLogin=()=>{
    const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = () => {
    console.log('Login data:', formData);
    alert('Login successful!');
  };

  const handleGoogleLogin = () => {
    console.log('Continue with Google');
    alert('Google login initiated');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
    alert('Password reset link sent!');
  };

  return{
    formData,
    handleForgotPassword,
    handleGoogleLogin,
    handleInputChange,
    handleLogin,
    
  }
}