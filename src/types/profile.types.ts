export interface IFoodieProfile {
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    image?: string;
    bio?: string;
    location?: string;
    phone?: string;
    preferences?: string[];
}

export interface IChefProfile {
    _id: string;
    chefId: {
        _id: string;
        name: string;
        email: string;
    };
    image?: string;
    bio?: string;
    specialities?: string[];
    certificates?: string[];
    achievements?: string[];
    skills?: string[];
}
