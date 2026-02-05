import { WORKSHOP_ROUTES } from "@/components/shared/constants/routes/workshop.routes";
import API from "./apiInstance";


export const createWorkshopApi = (data: any) => {
  return API.post(WORKSHOP_ROUTES.CHEF_CREATE, data);
};

export const updateWorkshopApi = (id: string, data: any) => {
  return API.put(WORKSHOP_ROUTES.CHEF_UPDATE(id), data);
};

export const getChefWorkshopsApi = (page = 1, limit = 6, search = "", status = "") => {
  return API.get(`${WORKSHOP_ROUTES.CHEF_LIST}?page=${page}&limit=${limit}&search=${search}&status=${status}`);
};

export const submitWorkshopForApprovalApi = (id: string) => {
  return API.patch(WORKSHOP_ROUTES.CHEF_SUBMIT(id));
};

export const startWorkshopApi = (id: string) => {
  return API.post(WORKSHOP_ROUTES.CHEF_START(id));
};

export const endWorkshopApi = (id: string) => {
  return API.post(WORKSHOP_ROUTES.CHEF_END(id));
};

export const cancelWorkshopApi = (id: string, reason: string) => {
  return API.patch(WORKSHOP_ROUTES.CHECK_CANCEL(id), { reason });
};


export const getAllWorkshopsAdminApi = () => {
  return API.get(WORKSHOP_ROUTES.ADMIN_LIST);
};

export const approveWorkshopApi = (id: string) => {
  return API.patch(WORKSHOP_ROUTES.ADMIN_APPROVE(id));
};

export const rejectWorkshopApi = (
  id: string,
  data: { rejectionReason: string }
) => {
  return API.patch(WORKSHOP_ROUTES.ADMIN_REJECT(id), data);
};


export const getApprovedWorkshopsApi = (
  page: number,
  limit: number,
  search?: string,
  filter?: string
) => {
  return API.get(WORKSHOP_ROUTES.APPROVED_LIST, {
    params: { page, limit, search, filter },
  });
};

export const getRecentWorkshopsApi = (limit: number) => {
  return API.get(WORKSHOP_ROUTES.RECENT, {
    params: { limit },
  });
};

export const getWorkshopByIdApi = (id: string) => {
  return API.get(WORKSHOP_ROUTES.GET_BY_ID(id));
};
