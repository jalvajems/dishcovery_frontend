import { useEffect, useState } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getReviewsApi } from "@/api/reviewApi";
import type { IReview } from "@/types/review.types";

type ReviewableType = "Recipe" | "Blog" | "Workshop" | "FoodSpot" | "Chef";

interface ChefReviewProps {
  reviewableId: string;
  reviewableType: ReviewableType;
}

export default function ChefReviewSection({ reviewableId, reviewableType }: ChefReviewProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy] = useState("latest");

  const getUserName = (user: IReview['userId']) => {
    if (!user) return "Anonymous";
    if (typeof user === 'string') return "Unknown User";
    return user.name;
  };

  const getUserAvatar = (user: IReview['userId']) => {
    if (!user || typeof user === 'string') return "/default-avatar.png";
    return user.avatar || "/default-avatar.png";
  };

  const loadReviews = async () => {
    if (!reviewableId) return;
    setLoading(true);

    try {
      const res = await getReviewsApi(reviewableId, reviewableType);

      const data = res.data.data;

      if (Array.isArray(data)) {

        setReviews(data);
      }
      else if (Array.isArray(data?.data)) {
        setReviews(data.data);
      }
      else {
        setReviews([]);
      }

    } catch (err) {
      console.error("Review fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [reviewableId]);

  /** Sorting Logic */
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "liked":
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const averageRating = reviews.length
    ? +(reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl mt-16">
      <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

      {/* SUMMARY */}
      <div className="flex items-center gap-6 mb-8">
        <div className="text-4xl font-bold">{averageRating || "0.0"}</div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                }`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm">({reviews.length} reviews)</p>
      </div>


      {/* REVIEW LIST */}
      {loading ? (
        <div>Loading reviews...</div>
      ) : sortedReviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet.</div>
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((r) => (
            <div key={r._id} className="bg-gray-50 p-6 rounded-xl shadow">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={getUserAvatar(r.userId)}
                  alt={getUserName(r.userId)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{getUserName(r.userId)}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>

              <p className="mb-3 text-gray-700">{r.reviewText}</p>

              {/* Likes / Dislikes (Chef View only — optional) */}
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-white border rounded">
                  <ThumbsUp className="w-4 h-4" /> {r.likes?.length || 0}
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white border rounded">
                  <ThumbsDown className="w-4 h-4" /> {r.dislikes?.length || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
