import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowUp, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

function NotFound() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Spinner */}
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

      
      {/* Page Header */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="bg-white p-5 rounded shadow">
                <h1 className="display-5 text-uppercase mb-3 animated slideInDown">404 Error</h1>
                <nav aria-label="breadcrumb animated slideInDown">
                  <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">404</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 404 Content */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="error-content bg-light p-5 rounded-3 shadow">
                <FaExclamationTriangle className="display-1 text-primary mb-4" style={{ fontSize: '6rem' }} />
                <h1 className="display-4 text-uppercase text-primary mb-3">404</h1>
                <h2 className="text-uppercase mb-4">Oops! Page Not Found</h2>
                <p className="fs-5 mb-4">
                  The page you are looking for might have been removed, had its name changed, 
                  or is temporarily unavailable.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    onClick={handleGoBack}
                    className="btn btn-primary py-3 px-4 rounded-pill"
                  >
                    Go Back
                  </button>
                  <Link 
                    to="/" 
                    className="btn btn-outline-primary py-3 px-4 rounded-pill"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container-fluid newsletter mt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container pb-5">
          <div className="bg-white p-5 rounded shadow">
            <div className="row g-5 align-items-center">
              <div className="col-md-6 wow fadeIn" data-wow-delay="0.3s">
                <h1 className="display-6 text-uppercase mb-4">Stay Updated</h1>
                <div className="d-flex align-items-center">
                  <FiMail className="text-primary me-4" style={{ fontSize: '3rem' }} />
                  <p className="fs-5 fst-italic mb-0">
                    Subscribe to our newsletter for the latest updates and offers.
                  </p>
                </div>
              </div>
              <div className="col-md-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="position-relative">
                  <input 
                    type="email" 
                    className="form-control border-0 bg-light py-3 ps-4 pe-5" 
                    placeholder="Your Email"
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary py-2 px-3 position-absolute top-50 end-0 translate-middle-y"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Back to Top */}
      <Link to="#" className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top">
        <FaArrowUp className="fs-4" />
      </Link>
    </>
  );
}

export default NotFound;