export interface IReview {
    _id: string;
    userId: {
        _id: string;
        name: string;
        avatar?: string;
    } | string;
    reviewableId: string;
    reviewableType: "Recipe" | "Blog" | "Workshop" | "FoodSpot" | "Chef";
    rating: number;
    reviewText: string;
    likes: string[];
    dislikes: string[];
    createdAt: string;
    updatedAt: string;
}
