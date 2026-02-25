import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PromoBanner from "./PromoBanner";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBanner />
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
