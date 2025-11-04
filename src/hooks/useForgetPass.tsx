import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useForgetPass=()=>{
  const navigate=useNavigate()
  const [email, setEmail] = useState('');

  const handleSendOTP = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    navigate('/resetPassword')
  };

  const handleLogIn = () => {
    navigate('/login')
  };
  
  return {
    setEmail,
    email,
    handleLogIn,
    handleSendOTP,
  }
}

