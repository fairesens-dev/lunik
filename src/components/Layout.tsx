import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PromoBanner from "./PromoBanner";
import ContactWidget from "./ContactWidget";
import CookieBanner from "./CookieBanner";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <ContactWidget />
      <CookieBanner />
    </div>
  );
};

export default Layout;
