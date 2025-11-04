import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin=()=>{

  const navigate=useNavigate();

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
    navigate('/forgetPassword')
  };
  const handleBackSignup=()=>{
    navigate('/signup')
  }

  return{
    formData,
    handleForgotPassword,
    handleGoogleLogin,
    handleInputChange,
    handleLogin,
    handleBackSignup
    
  }
}