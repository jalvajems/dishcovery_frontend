import { FOLLOW_ROUTES } from "@/components/shared/constants/routes/follow.routes";
import API from "./apiInstance";

export const followChefApi = (followingId: string) => {
    return API.post(FOLLOW_ROUTES.FOLLOW, { followingId });
};

export const unfollowChefApi = (followingId: string) => {
    return API.post(FOLLOW_ROUTES.UNFOLLOW, { followingId });
};

export const checkIsFollowingApi = (followingId: string) => {
    return API.get(FOLLOW_ROUTES.IS_FOLLOWING(followingId));
};

export const getFollowersApi = (page: number = 1, limit: number = 10) => {
    return API.get(FOLLOW_ROUTES.FOLLOWERS(page,limit));
};

export const getFollowingApi = (page: number = 1, limit: number = 10, search: string = '') => {
    return API.get(FOLLOW_ROUTES.FOLLOWING(page,limit,search));
};

export const getFollowStatsApi = (userId: string) => {
    return API.get(FOLLOW_ROUTES.STATS(userId));
};

export const getFoodieProfileForChefApi = (foodieId: string) => {
    return API.get(FOLLOW_ROUTES.FOODIE_PROFILE(foodieId));
};
