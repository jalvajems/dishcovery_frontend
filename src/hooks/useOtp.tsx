import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export  const useOtp=()=>{


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

    const newOtp = [...otp];
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

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      alert('Please enter the complete 4-digit OTP');
      return;
    }
    navigate('/login')
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