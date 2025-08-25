import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
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

      {/* Content */}
      {/* Page Header Start */}
      <div className="container-fluid page-header pt-5 mb-6 wow fadeIn" data-wow-delay="0.1s">
          <div className="container text-center pt-5">
              <div className="row justify-content-center">
                  <div className="col-lg-7">
                      <div className="bg-white p-5">
                          <h1 className="display-6 text-uppercase mb-3 animated slideInDown">Contact</h1>
                          <nav aria-label="breadcrumb animated slideInDown">
                              <ol className="breadcrumb justify-content-center mb-0">
                                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                  <li className="breadcrumb-item" aria-current="page">Contact</li>
                              </ol>
                          </nav>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* Page Header End */}


      {/* Contact Start */}
      <div className="pt-6 pb-6">
          <div className="container-fluid appoinment py-5 wow fadeIn" data-wow-delay="0.1s">
              <div className="container pt-5">
                  <div className="row gy-5 gx-0">
                      <div className="col-lg-6 pe-lg-5 wow fadeIn" data-wow-delay="0.3s">
                          <h1 className="display-6 text-uppercase text-white mb-4">Have Any Query? Feel Free To Contact Us
                          </h1>
                          <p className="text-white mb-5 wow fadeIn" data-wow-delay="0.4s">The contact form is currently inactive. Get a functional and working contact form with Ajax & PHP in a few minutes. Just copy and paste the files, add a little code and you're done. <a href="https://htmlcodex.com/contact-form">Download Now</a>.</p>
                          <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.5s">
                              <div className="btn-lg-square bg-white">
                                  <i className="bi bi-envelope-at text-dark fs-3"></i>
                              </div>
                              <div className="ms-3">
                                  <h6 className="text-white text-uppercase">Mail Us</h6>
                                  <span className="text-white">info@example.com</span>
                              </div>
                          </div>
                          <hr className="bg-body"/>
                          <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.6s">
                              <div className="btn-lg-square bg-white">
                                  <i className="bi bi-telephone text-dark fs-3"></i>
                              </div>
                              <div className="ms-3">
                                  <h6 className="text-white text-uppercase">Call Us</h6>
                                  <span className="text-white">+012 345 67890</span>
                              </div>
                          </div>
                      </div>
                      <div className="col-lg-6 mb-n5 wow fadeIn" data-wow-delay="0.7s">
                          <div className="bg-white p-5">
                              <h2 className="text-uppercase mb-4">Contact Us</h2>
                              <div className="row g-3">
                                  <div className="col-sm-6">
                                      <div className="form-floating">
                                          <input type="text" className="form-control border-0 bg-light" id="name" placeholder="Your Name"/>
                                          <label htmlFor="name">Your Name</label>
                                      </div>
                                  </div>
                                  <div className="col-sm-6">
                                      <div className="form-floating">
                                          <input type="email" className="form-control border-0 bg-light" id="mail" placeholder="Your Email"/>
                                          <label htmlFor="mail">Your Email</label>
                                      </div>
                                  </div>
                                  <div className="col-sm-6">
                                      <div className="form-floating">
                                          <input type="text" className="form-control border-0 bg-light" id="mobile" placeholder="Your Mobile"/>
                                          <label htmlFor="mobile">Your Mobile</label>
                                      </div>
                                  </div>
                                  <div className="col-sm-6">
                                      <div className="form-floating">
                                          <input type="text" className="form-control border-0 bg-light" id="subject" placeholder="Subject"/>
                                          <label htmlFor="subject">Subject</label>
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
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="container-fluid px-0 wow fadeInUp" data-wow-delay="0.5s">
              <iframe className="w-100 h-90"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
              frameBorder="0" style={{ minHeight: '500px', border: '0' }} allowFullScreen="" aria-hidden="false"
              tabIndex="0"></iframe>
          </div>
        </div>
      {/* Contact End */}


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
                              <input type="email" className="form-control border-0 bg-light" id="mail" placeholder="Your Email"/>
                              <label htmlFor="mail">Your Email</label>
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
export default Contact;