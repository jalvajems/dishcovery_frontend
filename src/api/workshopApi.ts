import API from "./apiInstance";

export const createWorkshopApi = (data: any) => {
    return API.post("/workshop/chef", data);
};

export const updateWorkshopApi = (id: string, data: any) => {
    return API.put(`/workshop/chef/${id}`, data);
};

export const getChefWorkshopsApi = () => {
    return API.get("/workshop/chef");
};

export const submitWorkshopForApprovalApi = (id: string) => {
    return API.patch(`/workshop/chef/${id}/submit`);
};

export const startWorkshopApi = (id: string) => {
    return API.post(`/workshop/chef/${id}/start`);
};

export const endWorkshopApi = (id: string) => {
    return API.post(`/workshop/chef/${id}/end`);
};

// Admin APIs
export const getAllWorkshopsAdminApi = () => {
    return API.get("/workshop/admin");
};

export const approveWorkshopApi = (id: string) => {
    return API.patch(`/workshop/admin/${id}/approve`);
};

export const rejectWorkshopApi = (id: string, data: { rejectionReason: string }) => {
    return API.patch(`/workshop/admin/${id}/reject`, data);
};

// Shared/Public/Foodie APIs
export const getApprovedWorkshopsApi = () => {
    return API.get("/workshop/approved");
};

export const getWorkshopByIdApi = (id: string) => {
    return API.get(`/workshop/${id}`);
};
