import { useState } from "react";

export const useSignup=()=>{

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

  const handleSignUp = () => {
    if (!agreedToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Sign up data:', formData);
    alert('Sign up successful!');
  };

  const handleBackToLogin = () => {
    console.log('Navigate to login');
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