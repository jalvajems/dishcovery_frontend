import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getReviewsApi, postReviewApi, likeReviewApi, dislikeReviewApi } from "@/api/reviewApi";
import { showError } from "@/utils/toast";

type ReviewableType = "Recipe" | "Blog" | "Workshop" | "FoodSpot" | "Chef";

interface ReviewSectionProps {
    reviewableId?: string; // optional if page will supply via params component
    reviewableType: ReviewableType;
}

export default function ReviewSection({ reviewableId, reviewableType }: ReviewSectionProps) {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadReviews = async (id?: string) => {
    if (!id) return;
    setLoading(true);

    try {
        const res = await getReviewsApi(id, reviewableType);

        let data = res.data.data;  

        
        if (Array.isArray(data)) {
            console.log('1');
            
            setReviews(data);
        } else if (!Array.isArray(data?.review)) {
            console.log('2');
            setReviews(data.data);
        } else {
            console.log('3');
            setReviews([]); 
        }
        
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};
console.log("review raw", reviews);

    useEffect(() => {
        if (reviewableId) loadReviews(reviewableId);
    }, [reviewableId]);

    const submitReview = async () => {
        if (!reviewableId) return alert("No target to review");
        if (!selectedRating) return alert("Please select a star rating");
        if (!reviewText.trim()) return alert("Please write a review");

        try {
            await postReviewApi({ reviewableId, reviewableType, rating: selectedRating, reviewText });
            setSelectedRating(0);
            setReviewText("");
            await loadReviews(reviewableId);

        } catch (err: any) {
            console.error(err);
            showError(err.response?.message || 'failed to post review')
        }
    };

    const handleLike = async (id: string) => {
        await likeReviewApi(id);
        if (reviewableId) loadReviews(reviewableId);
    };

    const handleDislike = async (id: string) => {
        await dislikeReviewApi(id);
        if (reviewableId) loadReviews(reviewableId);
    };

    const averageRating = reviews.length ? +(reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;

    return (
        <div>
            {/* Submit form */}
            <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>

                <div className="flex gap-3 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedRating(s)}
                            className={`px-4 py-2 rounded-md ${selectedRating === s ? "bg-green-600 text-white" : "bg-gray-100"}`}
                        >
                            {s} Star{s > 1 ? "s" : ""}
                        </button>
                    ))}
                </div>

                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-md border"
                    rows={5}
                />

                <div className="flex justify-end mt-4">
                    <button onClick={submitReview} className="px-6 py-2 bg-green-600 text-white rounded-md">Submit Review</button>
                </div>
            </div>

            {/* Rating overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">{averageRating || "0.0"}</div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                        ))}
                    </div>
                    <div className="text-sm text-gray-600">({reviews.length} reviews)</div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? <div>Loading reviews...</div> : reviews.map(r => (
                    <div key={r._id} className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <img src={r.userId?.avatar || "/default-avatar.png"} alt={r.userId?.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-semibold">{r.userId?.name || "Anonymous"}</div>
                                <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                            ))}
                        </div>

                        <p className="mb-3">{r.reviewText}</p>

                        <div className="flex gap-2">
                            <button onClick={() => handleLike(r._id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
                                <ThumbsUp className="w-4 h-4" /> {r.likes?.length || 0}
                            </button>
                            <button onClick={() => handleDislike(r._id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded">
                                <ThumbsDown className="w-4 h-4" /> {r.dislikes?.length || 0}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
