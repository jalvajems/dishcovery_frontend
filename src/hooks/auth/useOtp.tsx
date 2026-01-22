import { resendOtpApi, verifyForgetOtpApi, verifySignupOtpApi } from "@/api/authApi";
import { useOtpStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useOtp = () => {
  const { email, type, clearOtpData } = useOtpStore()
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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


  const handleVerify = async () => {
    if (otp.some((digit) => digit.trim() === "")) {
      setOtpError(true);
      showError("Please enter all 4 digits of the OTP");
      return;
    }

    const OtptoSend = otp.join('');

    try {
      setOtpError(false);

      if (type === 'signup') {
        await verifySignupOtpApi({ otp: OtptoSend, email });
        showSuccess("Signup OTP verified successfully!!");
        clearOtpData();
        navigate('/login');

      } else if (type === 'forgotPassword') {
        console.log('ss1');
        
        await verifyForgetOtpApi({ otp: OtptoSend, email });
        showSuccess("Forget password OTP verified successfully!!");
        clearOtpData();
        navigate('/resetPassword');
      }

    } catch (error: any) {

      setOtpError(true);

      const msg = error?.response?.data?.message || "Invalid OTP";
      showError(msg);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      const { data } = await resendOtpApi({ email: email })
      showSuccess(data.message)
      setTimer(60);
    } catch (error) {
      console.log(error);
    }
  }

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
    otpError,
    handleResendOtp,
    timer
  }
}

