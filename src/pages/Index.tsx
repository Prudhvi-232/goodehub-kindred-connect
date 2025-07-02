
import { useState } from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MainFeed from "../components/MainFeed";
import HelpDonateFeed from "../components/HelpDonateFeed";
import LeaderboardPage from "../components/LeaderboardPage";
import ChatPage from "../components/ChatPage";
import ProfilePage from "../components/ProfilePage";
import MapPage from "../components/MapPage";
import DonationPage from "../components/DonationPage";
import FriendsList from "../components/FriendsList";
import NotificationsList from "../components/NotificationsList";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderMainContent = () => {
    switch (activeTab) {
      case "help":
        return <HelpDonateFeed />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "donation":
        return <DonationPage />;
      case "location":
        return <MapPage />;
      case "chat":
        return <ChatPage />;
      case "profile":
        return <ProfilePage />;
      case "friends":
        return <FriendsList />;
      case "notifications":
        return <NotificationsList />;
      case "home":
      default:
        return <MainFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {renderMainContent()}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
