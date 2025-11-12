import { loginApi } from "@/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogin=()=>{

  const navigate=useNavigate();

    const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async() => {
    try {
      const data=await loginApi({email:formData.email, password:formData.password})
      localStorage.setItem('accessToken',data.data.accessToken);
      
      navigate('/home')
    } catch (error) {
      
    }
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