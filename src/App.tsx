import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import SAVPage from "./pages/SAVPage";
import ContactPage from "./pages/ContactPage";
import CGVPage from "./pages/CGVPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/store-coffre" element={<ProductPage />} />
            <Route path="/service-apres-vente" element={<SAVPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/conditions-generales-de-vente" element={<CGVPage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
