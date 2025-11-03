import { useState } from "react";

export const useResetPass=()=>{
    
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
    console.log('Password reset:', formData);
    alert('Password reset successfully!');
  };

  const handleLogIn = () => {
    console.log('Navigate to login');
  };

  return{
    formData,
    handleInputChange,
    handleLogIn,
    handleSubmit,
    setFormData,
  }
}