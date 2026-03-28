import { changePasswordApi } from "@/api/authApi";
import { getErrorMessage } from "@/utils/errorHandler";
import { showError, showSuccess } from "@/utils/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const tempErrors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        if (!formData.currentPassword.trim()) {
            tempErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword.trim()) {
            tempErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            tempErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword.trim()) {
            tempErrors.confirmPassword = "Confirm password is required";
        } else if (formData.confirmPassword !== formData.newPassword) {
            tempErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(tempErrors);

        return !tempErrors.currentPassword && !tempErrors.newPassword && !tempErrors.confirmPassword;
    };

    const handleSubmit = async () => {
        try {
            if (!validate()) return;

            const response = await changePasswordApi(formData);
            if (response.data.success) {
                showSuccess("Password changed successfully");
                navigate(-1); // Go back to profile
            }
        } catch (error: unknown) {
            showError(getErrorMessage(error, "Failed to change password"));
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return {
        formData,
        handleInputChange,
        handleBack,
        handleSubmit,
        errors
    };
};
