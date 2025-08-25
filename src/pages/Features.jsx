import React, { useEffect, useState } from 'react';
function Feature() {
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
    {/* <!-- Page Header Start --> */}
    <div className="container-fluid page-header pt-5 mb-6 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center pt-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="bg-white p-5">
                        <h1 className="display-6 text-uppercase mb-3 animated slideInDown">Features</h1>
                        <nav aria-label="breadcrumb animated slideInDown">
                            <ol className="breadcrumb justify-content-center mb-0">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item" aria-current="page">Features</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Page Header End --> */}


    {/* <!-- Features Start --> */}
    <div className="container-fluid pt-6 pb-6">
        <div className="container pt-4">
            <div className="row g-0 feature-row wow fadeIn" data-wow-delay="0.1s">
                <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.3s">
                    <div className="feature-item border h-100">
                        <div className="feature-icon btn-xxl-square bg-primary mb-4 mt-n4">
                            <i className="fa fa-hammer fa-2x text-white"></i>
                        </div>
                        <div className="p-5 pt-0">
                            <h5 className="text-uppercase mb-3">Quality Welding</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue.</p>
                            <a className="position-relative text-body text-uppercase small d-flex justify-content-between"
                                href="#"><b className="bg-white pe-3">Read More</b> <i
                                    className="bi bi-arrow-right bg-white ps-3"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.4s">
                    <div className="feature-item border h-100">
                        <div className="feature-icon btn-xxl-square bg-primary mb-4 mt-n4">
                            <i className="fa fa-dollar-sign fa-2x text-white"></i>
                        </div>
                        <div className="p-5 pt-0">
                            <h5 className="text-uppercase">Affordable Pricing</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue.</p>
                            <a class="position-relative text-body text-uppercase small d-flex justify-content-between"
                                href="#"><b class="bg-white pe-3">Read More</b> <i
                                    class="bi bi-arrow-right bg-white ps-3"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.5s">
                    <div class="feature-item border h-100">
                        <div class="feature-icon btn-xxl-square bg-primary mb-4 mt-n4">
                            <i class="fa fa-check-double fa-2x text-white"></i>
                        </div>
                        <div class="p-5 pt-0">
                            <h5 class="text-uppercase">Best Welder</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue.</p>
                            <a class="position-relative text-body text-uppercase small d-flex justify-content-between"
                                href="#"><b class="bg-white pe-3">Read More</b> <i
                                    class="bi bi-arrow-right bg-white ps-3"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 wow fadeIn" data-wow-delay="0.6s">
                    <div class="feature-item border h-100">
                        <div class="feature-icon btn-xxl-square bg-primary mb-4 mt-n4">
                            <i class="fa fa-tools fa-2x text-white"></i>
                        </div>
                        <div class="p-5 pt-0">
                            <h5 class="text-uppercase">Quality Tools</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue.</p>
                            <a class="position-relative text-body text-uppercase small d-flex justify-content-between"
                                href="#"><b class="bg-white pe-3">Read More</b> <i
                                    class="bi bi-arrow-right bg-white ps-3"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Features End --> */}


    {/* <!-- Features Start --> */}
    <div className="pb-6">
        <div className="container-fluid feature mt-6 wow fadeIn" data-wow-delay="0.1s">
            <div className="container">
                <div className="row g-0 justify-content-end">
                    <div className="col-lg-6 pt-5">
                        <div class="mt-5">
                            <h1 class="display-6 text-white text-uppercase mb-4 wow fadeIn" data-wow-delay="0.3s">Why You should Choose Our welding Services</h1>
                            <p class="text-light mb-4 wow fadeIn" data-wow-delay="0.4s">Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Curabitur tellus augue, iaculis id elit eget, ultrices pulvinar
                                tortor. Quisque vel lorem porttitor, malesuada arcu quis, fringilla risus. Pellentesque eu
                                consequat augue.</p>
                            <div class="row g-4 pt-2 mb-4">
                                <div class="col-sm-6 wow fadeIn" data-wow-delay="0.4s">
                                    <div class="flex-column text-center border border-5 border-primary p-5">
                                        <h1 class="text-white" data-toggle="counter-up">9999</h1>
                                        <p class="text-white text-uppercase mb-0">Satisfied Clients</p>
                                    </div>
                                </div>
                                <div class="col-sm-6 wow fadeIn" data-wow-delay="0.5s">
                                    <div class="flex-column text-center border border-5 border-primary p-5">
                                        <h1 class="text-white" data-toggle="counter-up">9999</h1>
                                        <p class="text-white text-uppercase mb-0">Complete Projects</p>
                                    </div>
                                </div>
                            </div>
                            <div class="border border-5 border-primary border-bottom-0 p-5">
                                <div class="experience mb-4 wow fadeIn" data-wow-delay="0.6s">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="text-white text-uppercase">Experience</span>
                                        <span class="text-white">90%</span>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar bg-primary" role="progressbar" aria-valuenow="90"
                                            aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div class="experience wow fadeIn" data-wow-delay="0.7s">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="text-white text-uppercase">Work Done</span>
                                        <span class="text-white">95%</span>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar bg-primary" role="progressbar" aria-valuenow="95"
                                            aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- Features End --> */}

    
    {/* // <!-- Newsletter Start --> */}
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
    {/* <!-- Newsletter End --> */}

    </>

  );
}

export default Feature;