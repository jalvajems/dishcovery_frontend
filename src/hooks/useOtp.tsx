import {  verifyOtpApi } from "@/api/authApi";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export  const useOtp=()=>{

  const {state}=useLocation();
  const navigate=useNavigate();  
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async() => {
    try {
      let OtptoSend=otp.join('')
      if(state.type=='signup'){
        await verifyOtpApi({otp:OtptoSend,email:state.email})
        navigate('/home')
      }else if(state.type=='forgetPass'){
        await verifyOtpApi({otp:OtptoSend,email:state.email})
        navigate('/resetPassword',{state:{email:state.email}})
      }
    } catch (error) {
      
    }
  };

  const handleLogIn = () => {
    navigate('/login')
  };

  return {
    handleChange,
    handleKeyDown,
    handleLogIn,
    handleVerify,
    inputRefs,
    otp,
    setOtp,
    useOtp,
  }

}