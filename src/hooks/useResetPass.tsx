import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useResetPass=()=>{
    
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    navigate('/otp-verify')
  };

  const handleLogIn = () => {
    navigate('/login')
  };

  return{
    formData,
    handleInputChange,
    handleLogIn,
    handleSubmit,
    setFormData,
  }
}