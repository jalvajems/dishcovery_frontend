import { REVIEW_ROUTES } from "@/components/shared/constants/routes/review.routes";
import API from "./apiInstance";

export const postReviewApi = (data: object) => {
  return API.post(REVIEW_ROUTES.CREATE, data);
};

export const getReviewsApi = (id: string, type: string) => {
  return API.get(REVIEW_ROUTES.LIST, {
    params: { id, type },
  });
};

export const likeReviewApi = (id: string) => {
  return API.put(REVIEW_ROUTES.LIKE(id));
};

export const dislikeReviewApi = (id: string) => {
  return API.put(REVIEW_ROUTES.DISLIKE(id));
};
