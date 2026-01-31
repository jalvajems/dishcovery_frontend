import API from "./apiInstance";

export const getUserNotificationsApi = (limit = 20, skip = 0) => {
    return API.get(`/notifications?limit=${limit}&skip=${skip}`);
};

export const markNotificationAsReadApi = (id: string) => {
    return API.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsReadApi = () => {
    return API.patch(`/notifications/read-all`);
};

export const getUnreadNotificationCountApi = () => {
    return API.get(`/notifications/unread-count`);
};

export const clearAllNotificationsApi = () => {
    return API.delete(`/notifications`);
};
