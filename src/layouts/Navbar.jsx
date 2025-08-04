import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading for 1 second

    return () => clearTimeout(timer);
  }, []);

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
          ></div>
        </div>
      )}

      {/* Content */}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
    	 {/* Topbar */}
        <div className="container-fluid bg-primary text-white d-none d-lg-flex wow fadeIn" data-wow-delay="0.1s">
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
                  <a className="btn btn-sm-square btn-light text-primary ms-2" href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-sm-square btn-light text-primary ms-2" href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="btn btn-sm-square btn-light text-primary ms-2" href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container-fluid bg-white sticky-top wow fadeIn" data-wow-delay="0.1s">
          <div className="container">
            <nav className="navbar navbar-expand-lg bg-white navbar-light p-lg-0">
              <NavLink to="/" className="navbar-brand d-lg-none text-decoration-none">
                <h1 className="fw-bold m-0">WELDORK</h1>
              </NavLink>

              <button
                type="button"
                className="navbar-toggler me-0" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarCollapse"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav">
                  <NavLink 
                    to="/" 
                    className="nav-item nav-link text-uppercase"
                    activeclassname="active"
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/about"
                    className="nav-item nav-link text-uppercase"
                    activeclassname="active"
                  >
                    About
                  </NavLink>

                  <NavLink
                    to="/service"
                    className="nav-item nav-link text-uppercase"
                    activeclassname="active"
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
                    >
                      Pages
                    </a>
                    <div className="dropdown-menu bg-light rounded-0 rounded-bottom m-0">
                      <NavLink to="/features" className="dropdown-item text-uppercase">Features</NavLink>
                      <NavLink to="/team" className="dropdown-item text-uppercase">Our Team</NavLink>
                      {/* <NavLink to="/testimonials" className="dropdown-item text-uppercase">Testimonial</NavLink> */}
                      <NavLink to="/appointment" className="dropdown-item text-uppercase">Appointment</NavLink>
                      {/* <NavLink to="/NotFound" className="dropdown-item text-uppercase">404 Page</NavLink> */}
                    </div>
                  </div>

                  <NavLink
                    to="/contact"
                    className="nav-item nav-link text-uppercase"
                    activeclassname="active"
                  >
                    Contact
                  </NavLink>
                </div>
                <div className="ms-auto d-none d-lg-block ">
                  <NavLink
                    to="/register"
                    className="btn btn-primary py-2 px-3 text-uppercase me-2"
                  >
                    Register
                  </NavLink>
				  <NavLink
                    to="/login"
                    className="btn btn-primary py-2 px-3 text-uppercase"
                  >
                    Login
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}



export default Navbar;