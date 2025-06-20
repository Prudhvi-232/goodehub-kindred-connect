
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Heart, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";

const HelpDonateFeed = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  const helpNeededPosts = [
    {
      id: 1,
      author: "City Animal Shelter",
      avatar: "🐕",
      time: "30 minutes ago",
      type: "help_needed",
      urgency: "High",
      title: "Urgent: Volunteers needed for dog walking",
      content: "We have 25+ dogs that need their daily walks but we're short-staffed today. Even 30 minutes of your time would make a huge difference for these furry friends! 🐕‍🦺",
      location: "Downtown Animal Shelter",
      volunteersNeeded: 8,
      volunteersJoined: 3,
      deadline: "Today, 6:00 PM",
      points: 50,
      tags: ["animals", "urgent", "walking"],
      difficulty: "Easy",
      likes: 12,
      comments: 4,
      images: ["photo-1601758228041-f3b2795255f1"]
    },
    {
      id: 2,
      author: "Riverside Community Center",
      avatar: "🏢",
      time: "2 hours ago",
      type: "help_needed",
      urgency: "Medium", 
      title: "Food distribution volunteers needed",
      content: "Help us distribute groceries to 50+ families this weekend. We need people to help pack bags, organize items, and assist with distribution. Great way to make a direct impact! 🛍️",
      location: "Riverside Community Center",
      volunteersNeeded: 15,
      volunteersJoined: 8,
      deadline: "Saturday, 9:00 AM",
      points: 100,
      tags: ["food", "families", "weekend"],
      difficulty: "Medium",
      likes: 28,
      comments: 7,
      images: ["photo-1593113616828-6f22bcd30a74"]
    },
    {
      id: 3,
      author: "Green Earth Initiative",
      avatar: "🌱",
      time: "4 hours ago",
      type: "help_needed",
      urgency: "Low",
      title: "Tree planting event - Join our green mission",
      content: "Help us plant 100 trees in Central Park! We'll provide all tools and refreshments. Come dressed in comfortable clothes and ready to get your hands dirty for Mother Earth! 🌳",
      location: "Central Park - North Entrance",
      volunteersNeeded: 25,
      volunteersJoined: 12,
      deadline: "Next Sunday, 8:00 AM",
      points: 150,
      tags: ["environment", "trees", "outdoor"],
      difficulty: "Hard",
      likes: 45,
      comments: 15,
      images: ["photo-1542601906990-b4d3fb778b09"]
    },
    {
      id: 4,
      author: "Sarah Mitchell",
      avatar: "👵",
      time: "6 hours ago",
      type: "help_needed",
      urgency: "Medium",
      title: "Elderly neighbor needs grocery help",
      content: "My elderly neighbor Mrs. Chen needs someone to help with grocery shopping. She's 82 and finds it difficult to carry heavy bags. Looking for a kind soul to help once a week! 🛒",
      location: "Oak Street Neighborhood",
      volunteersNeeded: 1,
      volunteersJoined: 0,
      deadline: "This week",
      points: 75,
      tags: ["elderly", "groceries", "weekly"],
      difficulty: "Easy",
      likes: 18,
      comments: 6,
      images: ["photo-1584464491033-06628f3a6b7b"]
    }
  ];

  const toggleLike = (postId) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High": return "border-l-red-500 bg-red-50";
      case "Medium": return "border-l-yellow-500 bg-yellow-50";
      case "Low": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getUrgencyBadgeColor = (urgency) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressPercentage = (joined, needed) => {
    return Math.min((joined / needed) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-xl">🤝</span>
          </div>
          <Button variant="outline" className="flex-1 justify-start text-gray-500 hover:bg-orange-50">
            Post a request for help in your community...
          </Button>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
            📋 Add Details
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
            ⏰ Set Deadline
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
            👥 Set Volunteers Needed
          </Button>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Help Needed in Your Community</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <span>Make a difference today</span>
        </div>
      </div>

      {helpNeededPosts.map((post) => (
        <Card key={post.id} className={`border-l-4 ${getUrgencyColor(post.urgency)} transition-all hover:shadow-lg`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{post.avatar}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{post.author}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getUrgencyBadgeColor(post.urgency)}`}>
                      {post.urgency} Priority
                    </span>
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
                <div className="font-bold text-orange-600">+{post.points} pts</div>
                <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getDifficultyColor(post.difficulty)}`}>
                  {post.difficulty}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            {post.images && (
              <div className="mb-4">
                <img 
                  src={`https://images.unsplash.com/${post.images[0]}?w=600&h=300&fit=crop`}
                  alt="Help needed"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {post.volunteersJoined}/{post.volunteersNeeded} volunteers
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Deadline: {post.deadline}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(post.volunteersJoined, post.volunteersNeeded)}%` }}
                ></div>
              </div>
            </div>

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
                  <span className="font-medium">Share</span>
                </button>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Volunteer Now
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HelpDonateFeed;
