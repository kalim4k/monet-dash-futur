
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProductPage from "./pages/ProductPage";
import PenisEnlargementPage from "./pages/PenisEnlargementPage";
import TikTokMonetizationPage from "./pages/TikTokMonetizationPage";
import PayPalAccountPage from "./pages/PayPalAccountPage";
import CapcutProPage from "./pages/CapcutProPage";
import FantasmesCouplePage from "./pages/FantasmesCouplePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/penis-enlargement" element={<PenisEnlargementPage />} />
            <Route path="/tiktok-monetization" element={<TikTokMonetizationPage />} />
            <Route path="/paypal-account" element={<PayPalAccountPage />} />
            <Route path="/capcut-pro" element={<CapcutProPage />} />
            <Route path="/fantasmes-couple" element={<FantasmesCouplePage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/payments" element={<Payments />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
