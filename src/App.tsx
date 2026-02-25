import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfiguratorSettingsProvider } from "@/contexts/ConfiguratorSettingsContext";
import { ContentProvider } from "@/contexts/ContentContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import SAVPage from "./pages/SAVPage";
import ContactPage from "./pages/ContactPage";
import CGVPage from "./pages/CGVPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminConfiguratorPage from "./pages/admin/AdminConfiguratorPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminMarketingPage from "./pages/admin/AdminMarketingPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ContentProvider>
        <ConfiguratorSettingsProvider>
        <AuthProvider>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/store-coffre" element={<ProductPage />} />
              <Route path="/service-apres-vente" element={<SAVPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/conditions-generales-de-vente" element={<CGVPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            </Route>

            {/* Admin login (public, no layout) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

            {/* Admin protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/commandes" element={<AdminOrdersPage />} />
                <Route path="/admin/leads" element={<AdminLeadsPage />} />
                <Route path="/admin/configurateur" element={<AdminConfiguratorPage />} />
                <Route path="/admin/contenu" element={<AdminContentPage />} />
                <Route path="/admin/marketing" element={<AdminMarketingPage />} />
                <Route path="/admin/parametres" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </ConfiguratorSettingsProvider>
        </ContentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
