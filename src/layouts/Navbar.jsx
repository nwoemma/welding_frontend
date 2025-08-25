import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


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

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {/* Topbar */}
        <div className="container-fluid bg-primary text-white fixed-top d-none d-lg-flex">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <NavLink to="/" className="text-decoration-none">
                <h2 className="text-white fw-bold m-0">WELDORK</h2>
              </NavLink>
              <div className="ms-auto d-flex align-items-center">
                <small className="ms-4">
                  <i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA
                </small>
                <small className="ms-4">
                  <i className="fa fa-envelope me-3"></i>info@example.com
                </small>
                <small className="ms-4">
                  <i className="fa fa-phone-alt me-3"></i>+012 345 67890
                </small>
                <div className="ms-3 d-flex">
                  <a className="btn btn-sm-square btn-light text-primary rounded-circle ms-2" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-sm-square btn-light text-primary rounded-circle ms-2" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn btn-sm-square btn-light text-primary rounded-circle ms-2" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div 
          className={`container-fluid bg-white fixed-top ${scrolled ? 'shadow-sm' : ''}`} 
          style={{ top: "70px", zIndex: 120 }}  // 👈 always sits BELOW the topbar
        >
          <div className="container">
            <nav className="navbar navbar-expand-lg bg-white navbar-light p-lg-0">
              <NavLink to="/" className="navbar-brand d-lg-none text-decoration-none">
                <h1 className="fw-bold m-0">WELDORK</h1>
              </NavLink>

              <button
                type="button"
                className="navbar-toggler me-0 border-0" 
                onClick={toggleMenu}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              
              {/* Overlay when menu is open */}
              {menuOpen && (
                <div 
                  className="menu-overlay"
                  onClick={toggleMenu}
                ></div>
              )}

              {/* Mobile Menu (slides from left)
              <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="navbar-nav h-100">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                    onClick={toggleMenu}
                    end
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/about"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                    onClick={toggleMenu}
                  >
                    About
                  </NavLink>

                  <NavLink
                    to="/service"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                    onClick={toggleMenu}
                  >
                    Services
                  </NavLink>

                  <div className="nav-item dropdown">
                    <a 
                      href="#" 
                      className="nav-link dropdown-toggle text-uppercase" 
                      role="button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu bg-light rounded-0 rounded-bottom m-0">
                      <NavLink 
                        to="/features" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                        onClick={toggleMenu}
                      >
                        Features
                      </NavLink>
                      <NavLink 
                        to="/team" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                        onClick={toggleMenu}
                      >
                        Our Team
                      </NavLink>
                      <NavLink 
                        to="/appointment" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                        onClick={toggleMenu}
                      >
                        Appointment
                      </NavLink>
                    </div>
                  </div>

                  <NavLink
                    to="/contact"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                    onClick={toggleMenu}
                  >
                    Contact
                  </NavLink>

                  {/* Mobile View Buttons */}
                  {/* <div className="mt-auto">
                    <NavLink
                      to="/register"
                      className="btn btn-primary w-100 py-2 text-uppercase mb-2"
                      onClick={toggleMenu}
                    >
                      Register
                    </NavLink>
                    <NavLink
                      to="/login"
                      className="btn btn-outline-primary w-100 py-2 text-uppercase"
                      onClick={toggleMenu}
                    >
                      Login
                    </NavLink>
                  </div>
                </div>
              </div> */} 

              {/* Desktop Menu */}
              <div className="collapse navbar-collapse d-lg-flex">
                <div className="navbar-nav">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                    end
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/about"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                  >
                    About
                  </NavLink>

                  <NavLink
                    to="/service"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                  >
                    Services
                  </NavLink>

                  <div className="nav-item dropdown">
                    <a 
                      href="#" 
                      className="nav-link dropdown-toggle text-uppercase" 
                      data-bs-toggle="dropdown"
                      role="button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu bg-light rounded-0 rounded-bottom m-0">
                      <NavLink 
                        to="/features" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                      >
                        Features
                      </NavLink>
                      <NavLink 
                        to="/team" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                      >
                        Our Team
                      </NavLink>
                      <NavLink 
                        to="/appointment" 
                        className={({ isActive }) => 
                          `dropdown-item text-uppercase ${isActive ? 'active' : ''}`
                        }
                      >
                        Appointment
                      </NavLink>
                    </div>
                  </div>

                  <NavLink
                    to="/contact"
                    className={({ isActive }) => 
                      `nav-item nav-link text-uppercase ${isActive ? 'active' : ''}`
                    }
                  >
                    Contact
                  </NavLink>
                </div>
                
                {/* Desktop View Buttons (right-aligned) */}
                <div className="ms-auto d-none d-lg-block">
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
              </div>
            </nav>
          </div>
        </div>
        <div style={{ paddingTop: "110px" }}></div>
      </div>
    </>
  );
}

export default Navbar;