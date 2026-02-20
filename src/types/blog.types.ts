export interface IBlog {
    _id: string;
    title: string;
    content: string;
    shortDescription: string;
    coverImage: string;
    chefName?: string;
    tags?: string[];
    chefId?: {
        _id: string;
        name: string;
        image?: string;
    } | string;
    likes?: number;
    isLiked?: boolean;
    createdAt: string | Date;
    updatedAt?: string | Date;
    isDraft?: boolean;
    isNew?: boolean;
}

export interface IBlogListResponse {
    datas: IBlog[];
    totalCount: number;
}
