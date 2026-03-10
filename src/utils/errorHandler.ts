import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown, fallbackMessage = 'An unexpected error occurred'): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || fallbackMessage;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return fallbackMessage;
};

export const logError = (error: unknown, context?: string) => {
    const message = getErrorMessage(error);
    if (context) {
        console.error(`[${context}]`, message, error);
    } else {
        console.error(message, error);
    }
};
