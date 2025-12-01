import { useState } from 'react';
import { Search, ChevronRight, UserMinus } from 'lucide-react';

export default function FollowersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const followers = [
    { id: 1, name: 'Sophia Clark', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 2, name: 'Ethan Bennett', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { id: 3, name: 'Olivia Harper', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { id: 4, name: 'Liam Carter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: 5, name: 'Ava Reynolds', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
    { id: 6, name: 'Noah Foster', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
    { id: 7, name: 'Isabella Morgan', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop' }
  ];

  const filteredFollowers = followers.filter(follower =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <a href="#" className="hover:text-green-600 transition-colors">My Recipes</a>
            <a href="#" className="hover:text-green-600 transition-colors">My Blogs</a>
            <a href="#" className="hover:text-green-600 transition-colors">My Workshops</a>
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
      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold hover:underline">Profile</a>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">Followers</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 bg-clip-text text-transparent">
            Followers
          </h1>
          <p className="text-green-600 font-semibold text-lg">123 followers</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search followers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/90 backdrop-blur-sm border-2 border-green-100 rounded-2xl text-gray-900 placeholder-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent transition-all shadow-lg text-lg"
            />
          </div>
        </div>

        {/* Followers List */}
        <div className="space-y-4">
          {filteredFollowers.map((follower) => (
            <div 
              key={follower.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full ring-4 ring-green-100 overflow-hidden shadow-md group-hover:ring-green-200 transition-all">
                    <img 
                      src={follower.avatar} 
                      alt={follower.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {follower.name}
                  </h3>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 hover:scale-105 transition-all border border-red-200">
                    <UserMinus className="w-5 h-5" />
                    remove
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all shadow-lg">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFollowers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No followers found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
}