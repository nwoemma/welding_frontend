import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <>
      {/* Footer Section */}
      <div className="container-fluid bg-dark footer py-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            {/* Office Info */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-uppercase text-light mb-4">Our Office</h5>
              <p className="mb-2"><i className="fa fa-map-marker-alt text-primary me-3"></i>123 Street, New York, USA</p>
              <p className="mb-2"><i className="fa fa-phone-alt text-primary me-3"></i>+012 345 67890</p>
              <p className="mb-2"><i className="fa fa-envelope text-primary me-3"></i>info@example.com</p>
              <div className="d-flex pt-3">
                <a className="btn btn-square btn-light me-2" href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-square btn-light me-2" href="#"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-square btn-light me-2" href="#"><i className="fab fa-youtube"></i></a>
                <a className="btn btn-square btn-light me-2" href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-uppercase text-light mb-4">Quick Links</h5>
              <Link className="btn btn-link" to="/about">About Us</Link>
              <Link className="btn btn-link" to="/contact">Contact Us</Link>
              <Link className="btn btn-link" to="/services">Our Services</Link>
              <Link className="btn btn-link" to="/terms">Terms & Condition</Link>
              <Link className="btn btn-link" to="/support">Support</Link>
            </div>

            {/* Business Hours */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-uppercase text-light mb-4">Business Hours</h5>
              <p className="text-uppercase mb-0">Monday - Friday</p>
              <p>09:00 am - 07:00 pm</p>
              <p className="text-uppercase mb-0">Saturday</p>
              <p>09:00 am - 12:00 pm</p>
              <p className="text-uppercase mb-0">Sunday</p>
              <p>Closed</p>
            </div>

            {/* Gallery */}
            <div className="col-lg-3 col-md-6">
              <h5 className="text-uppercase text-light mb-4">Gallery</h5>
              <div className="row g-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div className="col-4" key={num}>
                    <img className="img-fluid" src={`img/service-${num}.jpg`} alt={`Service ${num}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container-fluid text-body copyright py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <Link className="fw-semi-bold" to="/">Weldlock</Link>, All Right Reserved.
            </div>
            <div className="col-md-6 text-center text-md-end">
              Designed By <a className="fw-semi-bold" href="https://htmlcodex.com" target="_blank" rel="noreferrer">HTML Codex</a> Distributed by <a href="https://themewagon.com" target="_blank" rel="noreferrer">ThemeWagon</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
}

export default Footer;