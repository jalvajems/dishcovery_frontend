export interface IRecipe {
    _id: string;
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: number;
    difficulty: string;
    category: string;
    cuisine: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    images: string[];
    chefId?: {
        _id: string;
        name: string;
        image?: string;
    };
    chefName?: string;
    likes?: string[] | number;
    comments?: any[]; // refine if comment structure is known
    createdAt?: string | Date;
    updatedAt?: string | Date;
    isPremium?: boolean;
    price?: number;
    status?: string;
    averageRating?: number;
    totalRatings?: number;
    dietType?: string[];
    tags?: string[];
    steps?: string[];
    servings?: string | number;
}
