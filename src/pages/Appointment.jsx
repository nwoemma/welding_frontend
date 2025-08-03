import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Appointment() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

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
      
      {/* Page Header Start */}
      <div className="container-fluid page-header pt-5 mb-6 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center pt-5">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="bg-white p-5">
                <h1 className="display-6 text-uppercase mb-3 animated slideInDown">Appointment</h1>
                <nav aria-label="breadcrumb animated slideInDown">
                  <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item" aria-current="page">Appointment</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Appointment Start */}
      <div className="pt-6 pb-6">
        <div className="container-fluid appoinment py-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="container pt-5">
            <div className="row gy-5 gx-0">
              <div className="col-lg-6 pe-lg-5 wow fadeIn" data-wow-delay="0.3s">
                <h1 className="display-6 text-uppercase text-white mb-4">We Complete Welding & Metal Projects in Time</h1>
                <p className="text-white mb-5 wow fadeIn" data-wow-delay="0.4s">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue, iaculis id elit eget, ultrices pulvinar tortor.</p>
                <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.5s">
                  <div className="btn-lg-square bg-white">
                    <i className="bi bi-geo-alt text-dark fs-3"></i>
                  </div>
                  <div className="ms-3">
                    <h6 className="text-white text-uppercase">Office Address</h6>
                    <span className="text-white">123 Street, New York, USA</span>
                  </div>
                </div>
                <hr className="bg-body"/>
                <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.6s">
                  <div className="btn-lg-square bg-white">
                    <i className="bi bi-clock text-dark fs-3"></i>
                  </div>
                  <div className="ms-3">
                    <h6 className="text-white text-uppercase">Office Time</h6>
                    <span className="text-white">Mon-Sat 09am-5pm, Sun Closed</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-n5 wow fadeIn" data-wow-delay="0.7s">
                <div className="bg-white p-5">
                  <h2 className="text-uppercase mb-4">Online Appointment</h2>
                  <form>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="text" className="form-control border-0 bg-light" id="name" placeholder="Your Name" />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="email" className="form-control border-0 bg-light" id="mail" placeholder="Your Email" />
                          <label htmlFor="mail">Your Email</label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-floating">
                          <input type="text" className="form-control border-0 bg-light" id="mobile" placeholder="Your Mobile" />
                          <label htmlFor="mobile">Your Mobile</label>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-floating">
                          <select className="form-select border-0 bg-light" id="service">
                            <option value="Steel Welding">Steel Welding</option>
                            <option value="Pipe Welding">Pipe Welding</option>
                          </select>
                          <label htmlFor="service">Choose A Service</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea className="form-control border-0 bg-light" placeholder="Leave a message here" id="message"
                            style={{ height: '130px' }}></textarea>
                          <label htmlFor="message">Message</label>
                        </div>
                      </div>
                      <div className="col-12 text-center">
                        <button className="btn btn-primary w-100 py-3" type="submit">Submit Now</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Appointment End */}

      {/* Newsletter Start */}
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
                  <input type="email" className="form-control border-0 bg-light" id="newsletter-email" placeholder="Your Email" />
                  <label htmlFor="newsletter-email">Your Email</label>
                </div>
                <button className="btn btn-primary w-100 py-3" type="submit">Submit Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter End */}
    </>
  );
}

export default Appointment;