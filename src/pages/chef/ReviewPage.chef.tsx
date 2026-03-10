import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Reply, Flag, Trash2, ChevronDown } from 'lucide-react';

export default function WorkshopEngagementPage() {
  const [likedReviews, setLikedReviews] = useState<{ [key: number]: boolean }>({});
  const [dislikedReviews, setDislikedReviews] = useState<{ [key: number]: boolean }>({});

  const reviews = [
    {
      id: 1,
      name: 'Ethan Bennett',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      time: '3 weeks ago',
      rating: 4,
      text: 'Great experience overall. The workshop was well-organized and the food was fantastic. Could have used a bit more hands-on time.',
      likes: 8,
      dislikes: 1,
      type: 'review'
    },
    {
      id: 2,
      name: 'Olivia Hayes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      time: '1 month ago',
      rating: 3,
      text: 'It was okay. The chef was knowledgeable, but the workshop felt a bit rushed and the recipes were not as exciting as I expected.',
      likes: 5,
      dislikes: 3,
      type: 'review'
    },
    {
      id: 3,
      name: 'Liam Harper',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      time: '2 weeks ago',
      rating: 0,
      text: "Can't wait for the next workshop! Any plans for a vegan cooking class?",
      likes: 0,
      dislikes: 0,
      type: 'comment'
    }
  ];

  const handleLike = (reviewId: number) => {
    setLikedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
    if (dislikedReviews[reviewId]) {
      setDislikedReviews(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDislike = (reviewId: number) => {
    setDislikedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
    if (likedReviews[reviewId]) {
      setLikedReviews(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2.5"/>
            </svg>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dishcovery
            </span>
          </div>

          <div className="flex items-center gap-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-green-600 transition-colors">Home</a>
            <a href="#" className="hover:text-green-600 transition-colors">Recipes</a>
            <a href="#" className="hover:text-green-600 transition-colors">Chefs</a>
            <a href="#" className="hover:text-green-600 transition-colors">Food Spots</a>
            <a href="#" className="hover:text-green-600 transition-colors">Workshops</a>
            <a href="#" className="hover:text-green-600 transition-colors">Marketplace</a>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-lg ring-2 ring-white">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="User" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p className="text-green-600 font-medium">
            <a href="#" className="hover:underline">Blog name</a> / <span className="text-gray-700">Blog engagements management</span>
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            Workshop Engagement Management
          </h1>
          <p className="text-green-600 font-medium text-lg">
            Manage all reviews and comments for your workshops
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all font-semibold text-gray-700">
            Rating
            <ChevronDown className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all font-semibold text-gray-700">
            Date
            <ChevronDown className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all font-semibold text-gray-700">
            Type
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Reviews and Comments Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Reviews and Comments</h2>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                {/* User Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-green-100 shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">{review.time}</p>
                  </div>
                </div>

                {/* Star Rating (only for reviews) */}
                {review.type === 'review' && (
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < review.rating 
                            ? 'fill-green-500 text-green-500' 
                            : 'fill-gray-300 text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-5 text-lg">{review.text}</p>

                {/* Like/Dislike Buttons */}
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-semibold ${
                      likedReviews[review.id] 
                        ? 'bg-green-100 text-green-700 scale-105 shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{review.likes + (likedReviews[review.id] ? 1 : 0)}</span>
                  </button>
                  {review.type === 'review' && (
                    <button 
                      onClick={() => handleDislike(review.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-semibold ${
                        dislikedReviews[review.id] 
                          ? 'bg-red-100 text-red-700 scale-105 shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span>{review.dislikes + (dislikedReviews[review.id] ? 1 : 0)}</span>
                    </button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-8 pt-6 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-semibold">
                    <Reply className="w-5 h-5" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-semibold">
                    <Flag className="w-5 h-5" />
                    Report
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-semibold">
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}