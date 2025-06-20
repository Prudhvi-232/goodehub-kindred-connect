
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const MainFeed = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

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
      tags: ["food", "volunteer"]
    },
    {
      id: 2,
      author: "Maria Santos",
      avatar: "👩‍🎓",
      time: "4 hours ago",
      type: "help_needed",
      content: "Looking for volunteers to help with our weekend dog walking program at the animal shelter. We have 20+ dogs that need exercise and socialization. Perfect for animal lovers! 🐕",
      location: "Happy Paws Shelter",
      likes: 18,
      comments: 12,
      points: 75,
      tags: ["animals", "weekend"]
    },
    {
      id: 3,
      author: "Community Center",
      avatar: "🏢",
      time: "6 hours ago",
      type: "organization",
      content: "Thank you to all the volunteers who helped us paint the community center today! We transformed 3 rooms and it looks amazing. Special thanks to the 15 volunteers who showed up! 🎨",
      location: "Riverside Community Center",
      likes: 45,
      comments: 15,
      points: 200,
      tags: ["painting", "community"]
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "👨‍🔬",
      time: "1 day ago",
      type: "help_provided",
      content: "Spent the morning reading to children at the local library. Their enthusiasm for stories is infectious! Already signed up for next week's session. 📚",
      location: "City Library",
      likes: 32,
      comments: 6,
      points: 100,
      tags: ["education", "children"]
    }
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "help_provided": return "border-l-green-500 bg-green-50";
      case "help_needed": return "border-l-blue-500 bg-blue-50";
      case "organization": return "border-l-purple-500 bg-purple-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "help_provided": return "Help Provided ✅";
      case "help_needed": return "Help Needed 🆘";
      case "organization": return "Organization Update 🏢";
      default: return "Update";
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-xl">👩‍💻</span>
          </div>
          <Button variant="outline" className="flex-1 justify-start text-gray-500 hover:bg-blue-50">
            Share your good deed or ask for help...
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

      {/* Posts Feed */}
      {posts.map((post) => (
        <Card key={post.id} className={`border-l-4 ${getPostTypeColor(post.type)} transition-all hover:shadow-lg`}>
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{post.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{post.author}</h4>
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

            {/* Post Content */}
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Actions */}
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
                  <span className="font-medium">Join</span>
                </button>
              </div>
              
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                Support
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MainFeed;
