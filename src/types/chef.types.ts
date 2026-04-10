export interface IChefDetail {
    _id: string;
    chefId: {
        _id: string;
        name: string;
        image?: string;
        email: string;
    };
    image?: string;
    bio?: string;
    specialities?: string[];
    experience?: number;
    certificates?: string[];
    achievements?: string[];
    skills?: string[];
    location?: string;
    isVerified?: boolean;
    followersCount?: number;
    followingCount?: number;
    rating?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface IChefListItem {
    _id: string;
    chefId: {
        _id: string;
        name: string;
        image?: string;
    };
    image?: string;
    specialities: string[];
    experience: number;
    rating: number;
    isVerified: boolean;
    followersCount: number;
    reviewsCount: number;
}
