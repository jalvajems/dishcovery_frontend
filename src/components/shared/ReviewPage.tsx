import { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getReviewsApi, postReviewApi, likeReviewApi, dislikeReviewApi, updateReviewApi, deleteReviewApi } from "@/api/reviewApi";
import { showError } from "@/utils/toast";
import { getErrorMessage } from "@/utils/errorHandler";
import type { IReview } from "@/types/review.types";
import { useAuthStore } from "@/store/authStore";

type ReviewableType = "Recipe" | "Blog" | "Workshop" | "FoodSpot" | "Chef";

interface ReviewSectionProps {
    reviewableId?: string;
    reviewableType: ReviewableType;
}

export default function ReviewSection({ reviewableId, reviewableType }: ReviewSectionProps) {
    const { user } = useAuthStore();
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit state
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editRating, setEditRating] = useState<number>(0);
    const [editHoverRating, setEditHoverRating] = useState<number>(0);
    const [editReviewText, setEditReviewText] = useState<string>("");

    const loadReviews = async (id?: string) => {
        if (!id) return;
        setLoading(true);

        try {
            const res = await getReviewsApi(id, reviewableType);

            const data = res.data.data;


            if (Array.isArray(data)) {

                setReviews(data);
            } else if (!Array.isArray(data?.review)) {
                setReviews(data.data);
            } else {
                setReviews([]);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
console.log('----',reviews);

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

        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Failed to post review');
            console.error(err);
            showError(message);
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

    const handleEditStart = (review: IReview) => {
        setEditingReviewId(review._id);
        setEditRating(review.rating);
        setEditReviewText(review.reviewText);
    };

    const handleEditCancel = () => {
        setEditingReviewId(null);
        setEditRating(0);
        setEditReviewText("");
    };

    const handleEditSubmit = async (reviewId: string) => {
        if (!editRating) return alert("Please select a star rating");
        if (!editReviewText.trim()) return alert("Please write a review");

        try {
            await updateReviewApi(reviewId, { rating: editRating, reviewText: editReviewText });
            setEditingReviewId(null);
            if (reviewableId) loadReviews(reviewableId);
        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Failed to update review');
            showError(message);
        }
    };
    console.log('ssssssss',reviews[0]?.userId?.foodieProfile?.image)

    const handleDelete = async (reviewId: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await deleteReviewApi(reviewId);
            if (reviewableId) loadReviews(reviewableId);
        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Failed to delete review');
            showError(message);
        }
    };

    const averageRating = reviews.length ? +(reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0;

    return (
        <div>
            {/* Submit form */}
            <div className="bg-white p-8 rounded-2xl shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>

                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(star)}
                            type="button"
                        >
                            <Star
                                size={32}
                                className={`transition-colors duration-200 ${(hoverRating || selectedRating) >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
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
                    <div key={r._id} className="bg-white p-6 rounded-xl shadow-sm relative">
                        {editingReviewId === r._id ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className="transition-transform hover:scale-110 focus:outline-none"
                                            onMouseEnter={() => setEditHoverRating(star)}
                                            onMouseLeave={() => setEditHoverRating(0)}
                                            onClick={() => setEditRating(star)}
                                            type="button"
                                        >
                                            <Star
                                                size={24}
                                                className={`transition-colors duration-200 ${(editHoverRating || editRating) >= star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={editReviewText}
                                    onChange={(e) => setEditReviewText(e.target.value)}
                                    className="w-full p-3 rounded-md border"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={handleEditCancel} className="px-4 py-1 text-gray-600 bg-gray-200 rounded-md">Cancel</button>
                                    <button onClick={() => handleEditSubmit(r._id)} className="px-4 py-1 bg-green-600 text-white rounded-md">Save</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-4">
                                        <img src={typeof r.userId === 'object' && r.userId?.foodieProfile?.image ? r.userId?.foodieProfile?.image : "/default-avatar.png"} alt={typeof r.userId === 'object' ? r.userId?.name : "User"} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold">{typeof r.userId === 'object' ? r.userId?.name : "Anonymous"}</div>
                                            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {(user?.id === (typeof r.userId === 'object' ? r.userId?._id : r.userId)) && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditStart(r)} className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">Edit</button>
                                            <button onClick={() => handleDelete(r._id)} className="text-sm text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded">Delete</button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                    ))}
                                </div>

                                <p className="mb-3">{r.reviewText}</p>

                                <div className="flex gap-2">
                                    <button onClick={() => handleLike(r._id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                                        <ThumbsUp className="w-4 h-4" /> {r.likes?.length || 0}
                                    </button>
                                    <button onClick={() => handleDislike(r._id)} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                                        <ThumbsDown className="w-4 h-4" /> {r.dislikes?.length || 0}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
