import API from "./apiInstance";

export const postReviewApi = (data:object) => API.post("/foodie/review", data);

export const getReviewsApi = (id: string, type: string) =>
  API.get(`/foodie/review?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`);

export const likeReviewApi = (id: string) =>
  API.put(`/foodie/review/like/${id}`);

export const dislikeReviewApi = (id: string) =>
  API.put(`/foodie/review/dislike/${id}`);
