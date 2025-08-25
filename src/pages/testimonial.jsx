import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Testimonial() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Topbar */}
      {/* <div className="container-fluid bg-primary text-white d-none d-lg-flex wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-3">
          <div className="d-flex align-items-center">
            <Link to="/">
              <h2 className="text-white fw-bold m-0">WELDORK</h2>
            </Link>
            <div className="ms-auto d-flex align-items-center">
              <small className="ms-4"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</small>
              <small className="ms-4"><i className="fa fa-envelope me-3"></i>info@example.com</small>
              <small className="ms-4"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</small>
              <div className="ms-3 d-flex">
                <a className="btn btn-sm-square btn-light text-primary ms-2" href=""><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-sm-square btn-light text-primary ms-2" href=""><i className="fab fa-twitter"></i></a>
                <a className="btn btn-sm-square btn-light text-primary ms-2" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Navbar */}
      {/* <div className="container-fluid bg-white sticky-top wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <nav className="navbar navbar-expand-lg bg-white navbar-light p-lg-0">
            <Link to="/" className="navbar-brand d-lg-none">
              <h1 className="fw-bold m-0">WELDORK</h1>
            </Link>
            <button type="button" className="navbar-toggler me-0" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">Home</Link>
                <Link to="/about" className="nav-item nav-link">About</Link>
                <Link to="/service" className="nav-item nav-link">Services</Link>
                <div className="nav-item dropdown">
                  <Link to="#" className="nav-link dropdown-toggle active" data-bs-toggle="dropdown">Pages</Link>
                  <div className="dropdown-menu bg-light rounded-0 rounded-bottom m-0">
                    <Link to="/feature" className="dropdown-item">Features</Link>
                    <Link to="/team" className="dropdown-item">Our Team</Link>
                    <Link to="/testimonial" className="dropdown-item active">Testimonial</Link>
                    <Link to="/appointment" className="dropdown-item">Appointment</Link>
                    <Link to="/404" className="dropdown-item">404 Page</Link>
                  </div>
                </div>
                <Link to="/contact" className="nav-item nav-link">Contact</Link>
              </div>
              <div className="ms-auto d-none d-lg-block">
                <Link to="/quote" className="btn btn-primary py-2 px-3">Get A Quote</Link>
              </div>
            </div>
          </nav>
        </div>
      </div> */}

      {/* Page Header */}
      <div className="container-fluid page-header pt-5 mb-6 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center pt-5">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="bg-white p-5">
                <h1 className="display-6 text-uppercase mb-3 animated slideInDown">Testimonial</h1>
                <nav aria-label="breadcrumb animated slideInDown">
                  <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item" aria-current="page">Testimonial</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="container-fluid pt-6 pb-6">
        <div className="container">
          <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="display-6 text-uppercase mb-5">What They're Talking About Our Welding Work</h1>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
              <div className="testimonial-img">
                <div className="animated flip infinite">
                  <img className="img-fluid" src="/img/testimonial-1.jpg" alt="" />
                </div>
                <div className="animated flip infinite">
                  <img className="img-fluid" src="/img/testimonial-2.jpg" alt="" />
                </div>
                <div className="animated flip infinite">
                  <img className="img-fluid" src="/img/testimonial-3.jpg" alt="" />
                </div>
                <div className="animated flip infinite">
                  <img className="img-fluid" src="/img/testimonial-4.jpg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.5s">
              <div className="owl-carousel testimonial-carousel">
                {[1, 2, 3, 4].map((item) => (
                  <div className="testimonial-item" key={item}>
                    <div className="d-flex align-items-center mb-4">
                      <img className="img-fluid" src={`img/testimonial-${item}.jpg`} alt="" />
                      <div className="ms-3">
                        <div className="mb-2">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="far fa-star text-primary"></i>
                          ))}
                        </div>
                        <h5 className="text-uppercase">Client Name</h5>
                        <span>Profession</span>
                      </div>
                    </div>
                    <p className="fs-5">
                      Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore
                      lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="container-fluid newsletter mt-6 wow fadeIn" data-wow-delay="0.1s">
        <div className="container pb-5">
          <div className="bg-white p-5 mb-5">
            <div className="row g-5">
              <div className="col-md-6 wow fadeIn" data-wow-delay="0.3s">
                <h1 className="display-6 text-uppercase mb-4">Newsletter</h1>
                <div className="d-flex">
                  <i className="far fa-envelope-open fa-3x text-primary me-4"></i>
                  <p className="fs-5 fst-italic mb-0">Dolores sed duo clita tempor justo dolor et stet lorem kasd labore lorem ipsum.</p>
                </div>
              </div>
              <div className="col-md-6 wow fadeIn" data-wow-delay="0.5s">
                <div className="form-floating mb-3">
                  <input type="email" className="form-control border-0 bg-light" id="mail" placeholder="Your Email" />
                  <label htmlFor="mail">Your Email</label>
                </div>
                <button className="btn btn-primary w-100 py-3" type="submit">Submit Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );        
}
export default Testimonial;