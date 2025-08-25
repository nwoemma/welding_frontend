import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div
          className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
        >
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ display: isLoading ? "none" : "block" }}>
        {/* 🔹 Topbar (Desktop Only) */}
        <div className="container-fluid bg-primary text-white fixed-top d-none d-lg-flex">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <NavLink to="/" className="text-decoration-none">
                <h2 className="text-white fw-bold m-0">WELDORK</h2>
              </NavLink>
              <div className="ms-auto d-flex align-items-center">
                <small className="ms-4">
                  <i className="fa fa-map-marker-alt me-3"></i>123 Street, New
                  York, USA
                </small>
                <small className="ms-4">
                  <i className="fa fa-envelope me-3"></i>info@example.com
                </small>
                <small className="ms-4">
                  <i className="fa fa-phone-alt me-3"></i>+012 345 67890
                </small>
                <div className="ms-3 d-flex">
                  <a
                    className="btn btn-sm-square btn-light text-primary rounded-circle ms-2"
                    href="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    className="btn btn-sm-square btn-light text-primary rounded-circle ms-2"
                    href="#"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    className="btn btn-sm-square btn-light text-primary rounded-circle ms-2"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Desktop Navbar */}
        <div
          className={`container-fluid bg-white fixed-top d-none d-lg-block ${
            scrolled ? "shadow-sm" : ""
          }`}
          style={{ top: "70px", zIndex: 120 }}
        >
          <div className="container">
            <nav className="navbar navbar-expand-lg bg-white navbar-light p-lg-0">
              <div className="navbar-nav">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `nav-item nav-link text-uppercase ${
                      isActive ? "active" : ""
                    }`
                  }
                  end
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `nav-item nav-link text-uppercase ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/service"
                  className={({ isActive }) =>
                    `nav-item nav-link text-uppercase ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Services
                </NavLink>
                <div className="nav-item dropdown">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle text-uppercase"
                    data-bs-toggle="dropdown"
                  >
                    Pages
                  </a>
                  <div className="dropdown-menu bg-light rounded-0 rounded-bottom m-0">
                    <NavLink to="/features" className="dropdown-item text-uppercase">
                      Features
                    </NavLink>
                    <NavLink to="/team" className="dropdown-item text-uppercase">
                      Our Team
                    </NavLink>
                    <NavLink
                      to="/appointment"
                      className="dropdown-item text-uppercase"
                    >
                      Appointment
                    </NavLink>
                  </div>
                </div>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `nav-item nav-link text-uppercase ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  Contact
                </NavLink>
              </div>

              <div className="ms-auto">
                <NavLink
                  to="/register"
                  className="btn btn-primary py-2 px-3 text-uppercase me-2 rounded-pill"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="btn btn-outline-primary py-2 px-3 text-uppercase rounded-pill"
                >
                  Login
                </NavLink>
              </div>
            </nav>
          </div>
        </div>

        {/* 🔹 Mobile Navbar */}
        <div
          className={`container-fluid bg-white fixed-top d-flex d-lg-none ${
            scrolled ? "shadow-sm" : ""
          }`}
          style={{ zIndex: 120 }}
        >
          <div className="container">
            <nav className="navbar navbar-light d-flex justify-content-between">
              <NavLink to="/" className="navbar-brand fw-bold">
                WELDORK
              </NavLink>
              <button
                type="button"
                className="navbar-toggler border-0"
                onClick={toggleMenu}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </nav>

            {/* Mobile Menu Drawer - Only render when menuOpen is true */}
            {menuOpen && (
              <>
                {/* Overlay when menu is open */}
                <div 
                  className="position-fixed top-0 start-0 w-100 vh-100 bg-dark"
                  style={{ 
                    opacity: "0.5", 
                    zIndex: 125 
                  }}
                  onClick={closeMenu}
                ></div>
                
                {/* Drawer */}
                <div 
                  className="position-fixed top-0 end-0 vh-100 bg-white w-75"
                  style={{ 
                    zIndex: 130, 
                    transition: "transform 0.3s ease-in-out",
                    boxShadow: "-2px 0 8px rgba(0,0,0,0.2)"
                  }}
                >
                  <div className="p-4" style={{ width: "95%" }}>
                    <div className="d-flex justify-content-end mb-4">
                      <button 
                        className="btn btn-close" 
                        onClick={closeMenu}
                      ></button>
                    </div>
                    <div className="navbar-nav">
                      <NavLink
                        to="/"
                        className="nav-item nav-link text-uppercase mb-2"
                        onClick={closeMenu}
                        end
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/about"
                        className="nav-item nav-link text-uppercase mb-2"
                        onClick={closeMenu}
                      >
                        About
                      </NavLink>
                      <NavLink
                        to="/service"
                        className="nav-item nav-link text-uppercase mb-2"
                        onClick={closeMenu}
                      >
                        Services
                      </NavLink>
                      <NavLink
                        to="/contact"
                        className="nav-item nav-link text-uppercase mb-2"
                        onClick={closeMenu}
                      >
                        Contact
                      </NavLink>

                      <div className="mt-4">
                        <NavLink
                          to="/register"
                          className="btn btn-primary w-100 py-2 mb-2"
                          onClick={closeMenu}
                        >
                          Register
                        </NavLink>
                        <NavLink
                          to="/login"
                          className="btn btn-outline-primary w-100 py-2"
                          onClick={closeMenu}
                        >
                          Login
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Spacer so content is visible below nav */}
        <div style={{ paddingTop: "120px" }}></div>
      </div>

      {/* Add this style tag to your component to override any external CSS */}
      <style>
        {`
          /* Remove any conflicting mobile menu CSS */
          .mobile-menu {
            display: none !important;
          }
        `}
      </style>
    </>
  );
}

export default Navbar;