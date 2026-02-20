export interface IFoodSpot {
    _id: string;
    name: string;
    coverImage: string;
    description: string;
    images: string[];
    address?: {
        placeName: string;
        city: string;
        state: string;
        country: string;
        fullAddress: string;
    };
    openingHours: {
        open: string;
        close: string;
    };
    speciality: string[];
    tags: string[];
    exploredFoods: {
        name: string;
        price: number;
        image: string;
        description?: string;
    }[];
    foodieId: {
        _id: string;
        name: string;
        avatar?: string;
    };
    isApproved: boolean;
    isBlocked: boolean;
    likesCount?: number;
    savesCount?: number;
    location: {
        coordinates: [number, number];
        venueName?: string;
        address?: string;
        city?: string;
    };
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}
