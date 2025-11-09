import { resetPassApi } from "@/api/authApi";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useResetPass=()=>{
  const{state}=useLocation();
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

  const handleSubmit = async() => {
    try {
      if (!formData.newPassword || !formData.confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if(formData.newPassword!==formData.confirmPassword){
        alert('Passwords are not Match');
        return;
      }
      await resetPassApi({email: state.email,newPass:formData.newPassword,confirmPass:formData.confirmPassword})
      navigate('/login')
    } catch (error) {
      
    }
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