import API from "@/api/apiInstance";
import { signupApi } from "@/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignup=()=>{
  const navigate=useNavigate();

    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp =async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    try {
      const res=await signupApi({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })   
      console.log('signup data: ', res.data);
      
    } catch (error) {
      console.error("signup error:", error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return{
    handleBackToLogin,
    handleSignUp,
    handleInputChange,
    setAgreedToTerms,
    formData,
    agreedToTerms
  }

}