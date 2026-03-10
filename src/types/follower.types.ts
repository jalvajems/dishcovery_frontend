export interface IFollower {
    _id: string;
    followerId: {
        _id: string;
        name: string;
        image?: string;
    };
}

export interface IFollowing {
    _id: string;
    followingId: {
        _id: string;
        name: string;
        image?: string;
        location?: string;
        specialities?: string[];
    };
}
