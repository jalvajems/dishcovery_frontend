import API from "./apiInstance";

export const startSessionApi = async (workshopId: string) => {
    const response = await API.post(`/sessions/${workshopId}/start`);
    return response.data;
};

export const endSessionApi = async (workshopId: string) => {
    const response = await API.post(`/sessions/${workshopId}/end`);
    return response.data;
};

export const joinSessionApi = async (workshopId: string) => {
    const response = await API.post(`/sessions/${workshopId}/join`);
    return response.data;
};

export const leaveSessionApi = async (workshopId: string) => {
    const response = await API.post(`/sessions/${workshopId}/leave`);
    return response.data;
};

export const getSessionInfoApi = async (workshopId: string) => {
    const response = await API.get(`/sessions/${workshopId}/info`);
    return response.data;
};
