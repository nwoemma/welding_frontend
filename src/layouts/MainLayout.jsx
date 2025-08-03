import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function MainLayout({ showNavbar = true, showFooter = true }) {
  return (
    <div>
      {showNavbar && <Navbar />}
      <main>
        <Outlet /> {/* This renders the current page */}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;