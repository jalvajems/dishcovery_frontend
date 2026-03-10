import { forgetPassApi } from "@/api/authApi";
import { useOtpStore } from "@/store/authStore";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useForgetPass = () => {
  const navigate = useNavigate()
  const { setOtpData } = useOtpStore()
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    try {
      setOtpData(email, 'forgotPassword')
      await forgetPassApi({ email })
      navigate('/forget-otp-verify')
    } catch (error: unknown) {
      const msg = getErrorMessage(error, "Invalid OTP");
      showError(msg);
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

