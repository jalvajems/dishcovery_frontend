export const FOLLOW_ROUTES = {
  FOLLOW: "/follow/follow",
  UNFOLLOW: "/follow/unfollow",

  IS_FOLLOWING: (followingId: string) =>
    `/follow/is-following/${followingId}`,

  FOLLOWERS:(page:number,limit:number)=> `/follow/followers?page=${page}&limit=${limit}`,
  FOLLOWING:(page:number,limit:number,search:string)=> `/follow/following?page=${page}&limit=${limit}&search=${search}`,

  STATS: (userId: string) => `/follow/stats/${userId}`,

  FOODIE_PROFILE: (foodieId: string) =>
    `/follow/foodie-profile/${foodieId}`,
} as const;
