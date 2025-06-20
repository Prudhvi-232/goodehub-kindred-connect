
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, MapPin } from "lucide-react";

const RightSidebar = () => {
  const monthlyLeaders = [
    { name: "Alex Chen", points: 1850, avatar: "🧑‍💼", change: "+5" },
    { name: "Maria Santos", points: 1720, avatar: "👩‍🎓", change: "+2" },
    { name: "David Kim", points: 1680, avatar: "👨‍🔬", change: "-1" },
    { name: "Sarah Johnson", points: 1250, avatar: "👩‍💻", change: "+1" },
  ];

  const helpOpportunities = [
    { 
      title: "Feed stray dogs", 
      location: "Central Park", 
      points: 50, 
      difficulty: "Easy",
      urgency: "High"
    },
    { 
      title: "Visit elderly home", 
      location: "Sunrise Care", 
      points: 100, 
      difficulty: "Medium",
      urgency: "Medium"
    },
    { 
      title: "Food bank volunteer", 
      location: "Downtown", 
      points: 150, 
      difficulty: "Hard",
      urgency: "Low"
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "border-l-red-500";
      case "Medium": return "border-l-yellow-500";
      case "Low": return "border-l-green-500";
      default: return "border-l-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Monthly Leaderboard */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Crown className="w-4 h-4 mr-2 text-yellow-500" />
          Monthly Leaders
        </h4>
        <div className="space-y-3">
          {monthlyLeaders.map((leader, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{leader.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{leader.name}</p>
                  <p className="text-xs text-gray-500">{leader.points} points</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  leader.change.startsWith('+') ? 'bg-green-100 text-green-700' : 
                  leader.change.startsWith('-') ? 'bg-red-100 text-red-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {leader.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 text-sm">
          View Full Leaderboard
        </Button>
      </Card>

      {/* Help Opportunities */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
          Help Opportunities
        </h4>
        <div className="space-y-3">
          {helpOpportunities.map((opportunity, index) => (
            <div key={index} className={`bg-white border-l-4 ${getUrgencyColor(opportunity.urgency)} p-3 rounded-r-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900 text-sm">{opportunity.title}</h5>
                <span className="font-bold text-blue-600 text-sm">+{opportunity.points}pts</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {opportunity.location}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
                  {opportunity.difficulty}
                </span>
                <span className="text-xs text-gray-500">{opportunity.urgency} priority</span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-3 text-sm">
          See All Opportunities
        </Button>
      </Card>
    </div>
  );
};

export default RightSidebar;
