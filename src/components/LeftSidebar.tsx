
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Heart, Calendar } from "lucide-react";

const LeftSidebar = () => {
  const userStats = [
    { label: "Acts of Kindness", value: 24, icon: "💝" },
    { label: "Points Earned", value: 1250, icon: "⭐" },
    { label: "Friends Helped", value: 18, icon: "🤗" },
  ];

  const recentActivity = [
    { action: "Donated food", points: 50, time: "2 hours ago" },
    { action: "Helped elderly", points: 100, time: "1 day ago" },
    { action: "Dog walking", points: 30, time: "3 days ago" },
  ];

  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
          <p className="text-sm text-gray-600 mb-4">Community Helper</p>
          
          <div className="grid grid-cols-1 gap-3">
            {userStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span className="text-sm font-bold text-green-600">+{activity.points}pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LeftSidebar;
