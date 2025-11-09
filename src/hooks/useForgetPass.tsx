import { forgetPassApi } from "@/api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useForgetPass=()=>{
  const navigate=useNavigate()
  const [email, setEmail] = useState('');

  const handleSendOTP = async() => {
    try {
      await forgetPassApi({email})
      navigate('/otp-verify',{state:{email,type:'forgetPass'}})
    } catch (error) {
      
    }
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

