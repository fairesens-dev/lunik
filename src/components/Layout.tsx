import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PromoBanner from "./PromoBanner";
import ContactWidget from "./ContactWidget";
import CookieBanner from "./CookieBanner";
import { useContent } from "@/contexts/ContentContext";

const Layout = () => {
  const { content } = useContent();
  const bannerActive = content.promoBanner.active;

  return (
    <div className="min-h-screen flex flex-col">
      {bannerActive && (
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <PromoBanner />
        </div>
      )}
      <Header bannerOffset={bannerActive} />
      <main className={`flex-1 ${bannerActive ? "pt-[calc(5rem+40px)]" : "pt-20"}`}>
        <Outlet />
      </main>
      <Footer />
      <ContactWidget />
      <CookieBanner />
    </div>
  );
};

export default Layout;
