
import { Search, MessageSquare, Bell, User, LogOut, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "help", label: "Help/Donate", icon: "🤝" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "donation", label: "Donations", icon: "💝" },
    { id: "location", label: "Map", icon: "📍" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Goodhub
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-green-50 ${
                  activeTab === item.id
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for help opportunities..."
                className="pl-10 w-64 bg-gray-50 border-gray-200"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab("chat")}
              className={activeTab === "chat" ? "bg-green-50 text-green-600" : ""}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-5 h-5" />
              </Button>
              {user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
