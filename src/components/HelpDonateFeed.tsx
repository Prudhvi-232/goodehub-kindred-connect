
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Users, MapPin, Clock, Calendar } from "lucide-react";
import { useState } from "react";

const HelpDonateFeed = () => {
  const [interestedPosts, setInterestedPosts] = useState<number[]>([]);

  // Help needed posts and donation opportunities
  const helpPosts = [
    {
      id: 1,
      author: "Local Animal Shelter",
      avatar: "🐕",
      time: "3 hours ago",
      type: "help_needed",
      content: "We urgently need volunteers this weekend for our dog walking program! We have 25+ rescue dogs that need exercise and socialization. Perfect for animal lovers who want to make a difference. Training provided!",
      location: "Happy Paws Animal Shelter",
      urgency: "High",
      volunteers_needed: 8,
      volunteers_joined: 3,
      deadline: "This Weekend",
      points: 75,
      tags: ["animals", "weekend", "walking"],
      images: ["photo-1581090464777-f3220bbe1b8b"]
    },
    {
      id: 2,
      author: "Community Kitchen",
      avatar: "🍲",
      time: "5 hours ago",
      type: "help_needed",
      content: "Looking for volunteers to help prepare and serve meals this Thursday evening. We serve 200+ meals to homeless individuals every week. Come join our caring community!",
      location: "Downtown Community Kitchen",
      urgency: "Medium",
      volunteers_needed: 12,
      volunteers_joined: 7,
      deadline: "Thursday 6PM",
      points: 100,
      tags: ["food", "cooking", "homeless"],
      images: ["photo-1498050108023-c5249f4df085"]
    },
    {
      id: 3,
      author: "Green Earth Initiative",
      avatar: "🌱",
      time: "1 day ago",
      type: "help_needed",
      content: "Beach cleanup drive this Saturday! Help us remove plastic waste and protect marine life. We'll provide all equipment, gloves, and refreshments. Let's make our beaches beautiful again! 🏖️",
      location: "Sunset Beach",
      urgency: "Medium",
      volunteers_needed: 50,
      volunteers_joined: 23,
      deadline: "Saturday 8AM",
      points: 120,
      tags: ["environment", "beach", "cleanup"],
      images: ["photo-1526374965328-7f61d4dc18c5"]
    },
    {
      id: 4,
      author: "Elderly Care Center",
      avatar: "👴",
      time: "2 days ago",
      type: "help_needed",
      content: "We need caring volunteers to spend time with our elderly residents. Activities include reading, playing games, helping with crafts, or just having conversations. Bring joy to someone's day!",
      location: "Sunshine Senior Center",
      urgency: "Low",
      volunteers_needed: 6,
      volunteers_joined: 2,
      deadline: "Ongoing",
      points: 80,
      tags: ["elderly", "companionship", "indoor"],
      images: ["photo-1531297484001-80022131f5a1"]
    }
  ];

  const toggleInterest = (postId: number) => {
    setInterestedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "border-l-red-500 bg-red-50";
      case "Medium": return "border-l-yellow-500 bg-yellow-50";
      case "Low": return "border-l-blue-500 bg-blue-50";
      default: return "border-l-gray-500 bg-gray-50";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Low": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Help Request */}
      <Card className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-xl">🆘</span>
          </div>
          <Button variant="outline" className="flex-1 justify-start text-gray-500 hover:bg-orange-100">
            Post a help request or donation need...
          </Button>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
            🆘 Need Help
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
            💝 Need Donations
          </Button>
          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-100">
            📅 Set Deadline
          </Button>
        </div>
      </Card>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Help Needed & Donations</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">Filter by Location</Button>
          <Button variant="outline" size="sm">Filter by Type</Button>
        </div>
      </div>

      {/* Help Posts Feed */}
      {helpPosts.map((post) => (
        <Card key={post.id} className={`border-l-4 ${getUrgencyColor(post.urgency)} transition-all hover:shadow-lg`}>
          <div className="p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{post.avatar}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{post.author}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyBadge(post.urgency)}`}>
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
                <div className="text-xs font-medium text-gray-600 mb-1">
                  Help Needed 🆘
                </div>
                <div className="font-bold text-blue-600">+{post.points} pts</div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Images */}
            {post.images && (
              <div className="mb-4">
                <img 
                  src={`https://images.unsplash.com/${post.images[0]}?w=600&h=300&fit=crop`}
                  alt="Help needed activity"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Volunteer Progress */}
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {post.volunteers_joined} of {post.volunteers_needed} volunteers joined
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{post.deadline}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(post.volunteers_joined / post.volunteers_needed) * 100}%` }}
                ></div>
              </div>
            </div>

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
                  onClick={() => toggleInterest(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    interestedPosts.includes(post.id) 
                      ? 'text-red-600 hover:text-red-700' 
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${interestedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                  <span className="font-medium">Interested</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">Ask Questions</span>
                </button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="hover:bg-blue-50">
                  Share
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Volunteer Now
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HelpDonateFeed;
