
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const MainFeed = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  const posts = [
    {
      id: 1,
      author: "Alex Chen",
      avatar: "🧑‍💼",
      time: "2 hours ago",
      type: "help_provided",
      content: "Just finished helping at the local food bank! Packed 150 meals for families in need. The volunteers were amazing and it felt great to give back to our community. 💕",
      location: "Downtown Food Bank",
      likes: 24,
      comments: 8,
      points: 150,
      tags: ["food", "volunteer"],
      isFollowing: true,
      images: ["photo-1649972904349-6e44c42644a7"]
    },
    {
      id: 2,
      author: "Maria Santos",
      avatar: "👩‍🎓",
      time: "6 hours ago",
      type: "help_provided",
      content: "Spent the morning reading to children at the local library. Their enthusiasm for stories is infectious! Already signed up for next week's session. 📚",
      location: "City Library",
      likes: 32,
      comments: 6,
      points: 100,
      tags: ["education", "children"],
      isFollowing: true,
      images: ["photo-1581091226825-a6a2a5aee158"]
    },
    {
      id: 3,
      author: "Community Hero Foundation",
      avatar: "🏆",
      time: "1 day ago",
      type: "help_provided",
      content: "Our team completed a major cleanup drive at Riverside Park today! Over 200 volunteers joined us to remove 2 tons of litter and planted 50 new trees. Together, we're making our city greener! 🌳",
      location: "Riverside Park",
      likes: 156,
      comments: 28,
      points: 500,
      tags: ["environment", "cleanup"],
      isFollowing: false,
      isBigshot: true,
      images: ["photo-1721322800607-8c38375eef04"]
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "👨‍🔬",
      time: "1 day ago",
      type: "help_provided",
      content: "Delivered groceries to 8 elderly neighbors today. Mrs. Johnson's smile when she saw the fresh fruits made my whole week! Small acts, big impact. ❤️",
      location: "Oak Street Neighborhood",
      likes: 45,
      comments: 12,
      points: 120,
      tags: ["elderly", "groceries"],
      isFollowing: true,
      images: ["photo-1488590528505-98d2b5aba04b"]
    }
  ];

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getPostTypeColor = (type) => {
    return "border-l-green-500 bg-green-50";
  };

  const getPostTypeLabel = (type) => {
    return "Help Provided ✅";
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-xl">👩‍💻</span>
          </div>
          <Button variant="outline" className="flex-1 justify-start text-gray-500 hover:bg-blue-50">
            Share your good deed or inspiring story...
          </Button>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
            📷 Add Photo
          </Button>
          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
            🗺️ Add Location
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
            🏷️ Add Tags
          </Button>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Recent Good Deeds</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>From people you follow and top helpers</span>
        </div>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className={`border-l-4 ${getPostTypeColor(post.type)} transition-all hover:shadow-lg`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{post.avatar}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{post.author}</h4>
                    {post.isFollowing && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Following</span>
                    )}
                    {post.isBigshot && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">🏆 Top Helper</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{post.time}</span>
                    <span>•</span>
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {getPostTypeLabel(post.type)}
                </div>
                <div className="font-bold text-green-600">+{post.points} pts</div>
              </div>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            {post.images && (
              <div className="mb-4">
                <img 
                  src={`https://images.unsplash.com/${post.images[0]}?w=600&h=300&fit=crop`}
                  alt="Help activity"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    likedPosts.includes(post.id) 
                      ? 'text-red-600 hover:text-red-700' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                  <span className="font-medium">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{post.comments}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Inspire</span>
                </button>
              </div>
              
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                Appreciate
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MainFeed;
