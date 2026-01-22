import { SESSION_ROUTES } from "@/components/shared/constants/routes/session.routes";
import API from "./apiInstance";

export const startSessionApi = async (workshopId: string) => {
  const response = await API.post(
    SESSION_ROUTES.START(workshopId)
  );
  return response.data;
};

export const endSessionApi = async (workshopId: string) => {
  const response = await API.post(
    SESSION_ROUTES.END(workshopId)
  );
  return response.data;
};

export const joinSessionApi = async (workshopId: string) => {
  const response = await API.post(
    SESSION_ROUTES.JOIN(workshopId)
  );
  return response.data;
};

export const leaveSessionApi = async (workshopId: string) => {
  const response = await API.post(
    SESSION_ROUTES.LEAVE(workshopId)
  );
  return response.data;
};

export const getSessionInfoApi = async (workshopId: string) => {
  const response = await API.get(
    SESSION_ROUTES.INFO(workshopId)
  );
  return response.data;
};
