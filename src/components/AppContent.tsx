import { useAuth } from "../contexts/AuthContext";
import AuthWrapper from "./AuthWrapper";
import Index from "../pages/Index";

const AppContent = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth pages
  if (!user) {
    return <AuthWrapper />;
  }

  // If user is logged in, show the main application
  return <Index />;
};

export default AppContent;