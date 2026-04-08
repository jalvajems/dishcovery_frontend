import { resendOtpApi, verifyForgetOtpApi, verifySignupOtpApi } from "@/api/authApi";
import { useOtpStore } from "@/store/authStore";
import { showError, showSuccess } from "@/utils/toast";
import { getErrorMessage, logError } from "@/utils/errorHandler";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useOtp = () => {
  const { email, type, otpExpiry, clearOtpData, setOtpExpiry } = useOtpStore()
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!otpExpiry) return 0;
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((otpExpiry - now) / 1000));
      return remaining;
    };

    setTimer(calculateTimeRemaining());

    let interval: NodeJS.Timeout;
    if (calculateTimeRemaining() > 0) {
      interval = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimer(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpExpiry]);

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


  const handleVerify = async () => {
    if (timer <= 0) {
      setOtpError(true);
      showError("OTP has expired. Please resend the OTP.");
      return;
    }

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
        navigate('/resetPassword');
      }

    } catch (error: unknown) {
      setOtpError(true);
      const msg = getErrorMessage(error, "Invalid OTP");
      showError(msg);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      const { data } = await resendOtpApi({ email: email })
      showSuccess(data.message)
      setOtpExpiry(Date.now() + 60 * 1000);
    } catch (error) {
      logError(error, "Resend OTP failed");
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

