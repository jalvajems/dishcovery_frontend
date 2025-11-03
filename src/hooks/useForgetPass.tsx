import { useState } from "react";

export const useForgetPass=()=>{
      const [email, setEmail] = useState('');

  const handleSendOTP = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    console.log('Sending OTP to:', email);
    alert('Reset OTP sent to your email!');
  };

  const handleLogIn = () => {
    console.log('Navigate to login');
  };
  
  return {
    setEmail,
    email,
    handleLogIn,
    handleSendOTP,
  }
}

