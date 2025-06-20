
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import AppContent from "./components/AppContent";

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
<<<<<<< HEAD:src/App.tsx
    </AuthProvider>
  );
}
=======
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
>>>>>>> 396a246bdcf3d27d9816041e122982e53ba99e4d:src/App.jsx

export default App;
