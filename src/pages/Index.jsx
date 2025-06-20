
import { useState } from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MainFeed from "../components/MainFeed";
import HelpDonateFeed from "../components/HelpDonateFeed";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderMainContent = () => {
    switch (activeTab) {
      case "help":
        return <HelpDonateFeed />;
      case "home":
      default:
        return <MainFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          <div className="lg:col-span-6">
            {renderMainContent()}
          </div>

          <div className="lg:col-span-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
