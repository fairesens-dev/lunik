import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfiguratorSettingsProvider } from "@/contexts/ConfiguratorSettingsContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { CartProvider } from "@/contexts/CartContext";
import { ContactWidgetProvider } from "@/contexts/ContactWidgetContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import SAVPage from "./pages/SAVPage";
import ContactPage from "./pages/ContactPage";
import CGVPage from "./pages/CGVPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import CookiesPage from "./pages/CookiesPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ConfigurateurPage from "./pages/ConfigurateurPage";
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
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";

import AdminTrackingPage from "./pages/admin/AdminTrackingPage";
import AdminContactsPage from "./pages/admin/AdminContactsPage";
import AdminContactDetailPage from "./pages/admin/AdminContactDetailPage";
import AdminCampaignsPage from "./pages/admin/AdminCampaignsPage";
import AdminCampaignBuilderPage from "./pages/admin/AdminCampaignBuilderPage";
import AdminCampaignReportPage from "./pages/admin/AdminCampaignReportPage";
import AdminModalsPage from "./pages/admin/AdminModalsPage";
import AdminModalBuilderPage from "./pages/admin/AdminModalBuilderPage";
import AdminScoringPage from "./pages/admin/AdminScoringPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ContentProvider>
        <ConfiguratorSettingsProvider>
        <CartProvider>
        <AuthProvider>
        <ContactWidgetProvider>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/store-coffre" element={<Navigate to="/configurateur" replace />} />
              <Route path="/service-apres-vente" element={<SAVPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/conditions-generales-de-vente" element={<CGVPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/suivi" element={<OrderTrackingPage />} />
            </Route>

            {/* Standalone pages (no main layout) */}
            <Route path="/configurateur" element={<ConfigurateurPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/merci" element={<ThankYouPage />} />

            {/* Admin login (public, no layout) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

            {/* Admin protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/commandes" element={<AdminOrdersPage />} />
                <Route path="/admin/commandes/:orderId" element={<AdminOrderDetailPage />} />
                
                <Route path="/admin/leads" element={<AdminLeadsPage />} />
                <Route path="/admin/configurateur" element={<AdminConfiguratorPage />} />
                <Route path="/admin/contenu" element={<AdminContentPage />} />
                <Route path="/admin/marketing" element={<AdminMarketingPage />} />
                <Route path="/admin/tracking" element={<AdminTrackingPage />} />
                <Route path="/admin/contacts" element={<AdminContactsPage />} />
                <Route path="/admin/contacts/:id" element={<AdminContactDetailPage />} />
                <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
                <Route path="/admin/campaigns/new" element={<AdminCampaignBuilderPage />} />
                <Route path="/admin/campaigns/:id/edit" element={<AdminCampaignBuilderPage />} />
                <Route path="/admin/campaigns/:id/report" element={<AdminCampaignReportPage />} />
                <Route path="/admin/modals" element={<AdminModalsPage />} />
                <Route path="/admin/modals/new" element={<AdminModalBuilderPage />} />
                <Route path="/admin/modals/:id/edit" element={<AdminModalBuilderPage />} />
                <Route path="/admin/scoring" element={<AdminScoringPage />} />
                <Route path="/admin/parametres" element={<AdminSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ContactWidgetProvider>
        </AuthProvider>
        </CartProvider>
        </ConfiguratorSettingsProvider>
        </ContentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
