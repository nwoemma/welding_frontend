import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
function Service() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Spinner */}
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
            <div className="container-fluid page-header pt-5 mb-6 wow fadeIn" data-wow-delay="0.1s">
                <div className="container text-center pt-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="bg-white p-5">
                                <h1 className="display-6 text-uppercase mb-3 animated slideInDown">Sevices</h1>
                                <nav aria-label="breadcrumb animated slideInDown">
                                    <ol className="breadcrumb justify-content-center mb-0">
                                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                        <li className="breadcrumb-item" aria-current="page">Services</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        
        {/* Services Section */}
        <div className="container-fluid service pt-6 pb-6">
          <div className="container">
            <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: 600 }}>
              <h1 className="display-6 text-uppercase mb-5">Reliable & High-Quality Welding Services</h1>
            </div>
            <div className="row g-4">
              {servicesData.map((service, index) => (
                <ServiceItem 
                  key={index}
                  delay={`${0.1 * (index + 1)}s`}
                  imgSrc={service.imgSrc}
                  title={service.title}
                  description={service.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Section */}
        <div className="container-fluid appoinment mt-6 mb-6 py-5 wow fadeIn" data-wow-delay="0.1s">
          <AppointmentForm />
        </div>

        {/* Testimonials */}
        <div className="container-fluid pt-6 pb-6">
          <Testimonials />
        </div>

        {/* Newsletter */}
        <div className="container-fluid newsletter mt-6 wow fadeIn" data-wow-delay="0.1s">
          <Newsletter />
        </div>
    </>
  );
}

// Sub-components
const ServiceItem = ({ delay, imgSrc, title, description }) => (
  <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={delay}>
    <div className="service-item">
      <div className="service-inner pb-5">
        <img className="img-fluid w-100" src={imgSrc} alt={title}/>
        <div className="service-text px-5 pt-4">
          <h5 className="text-uppercase">{title}</h5>
          <p>{description}</p>
        </div>
        <a className="btn btn-light px-3" href="">
          Read More<i className="bi bi-chevron-double-right ms-1"></i>
        </a>
      </div>
    </div>
  </div>
);

const AppointmentForm = () => (
  <div className="container pt-5">
    <div className="row gy-5 gx-0">
      <div className="col-lg-6 pe-lg-5 wow fadeIn" data-wow-delay="0.3s">
        <h1 className="display-6 text-uppercase text-white mb-4">We Complete Welding & Metal Projects in Time</h1>
        <p className="text-white mb-5 wow fadeIn" data-wow-delay="0.4s">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tellus augue, iaculis id elit eget, ultrices pulvinar tortor.
        </p>
        <ContactInfo />
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
                  <input type="email" className="form-control border-0 bg-light" id="email" placeholder="Your Email" />
                  <label htmlFor="email">Your Email</label>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-floating">
                  <input type="tel" className="form-control border-0 bg-light" id="phone" placeholder="Your Phone" />
                  <label htmlFor="phone">Your Phone</label>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-floating">
                  <select className="form-select border-0 bg-light" id="service">
                    <option value="steel">Steel Welding</option>
                    <option value="pipe">Pipe Welding</option>
                    <option value="custom">Custom Welding</option>
                  </select>
                  <label htmlFor="service">Choose A Service</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating">
                  <textarea 
                    className="form-control border-0 bg-light" 
                    placeholder="Leave a message here" 
                    id="message"
                    style={{ height: '130px' }}
                  ></textarea>
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
);

const ContactInfo = () => (
  <>
    <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.5s">
      <div className="btn-lg-square bg-white">
        <i className="bi bi-geo-alt text-dark fs-3"></i>
      </div>
      <div className="ms-3">
        <h6 className="text-white text-uppercase">Office Address</h6>
        <span className="text-white">123 Street, New York, USA</span>
      </div>
    </div>
    <hr className="bg-body" />
    <div className="d-flex align-items-start wow fadeIn" data-wow-delay="0.6s">
      <div className="btn-lg-square bg-white">
        <i className="bi bi-clock text-dark fs-3"></i>
      </div>
      <div className="ms-3">
        <h6 className="text-white text-uppercase">Office Time</h6>
        <span className="text-white">Mon-Sat 09am-5pm, Sun Closed</span>
      </div>
    </div>
  </>
);

const Testimonials = () => (
  <div className="container">
    <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
      <h1 className="display-6 text-uppercase mb-5">What They're Talking About Our Welding Work</h1>
    </div>
    <div className="row g-5 align-items-center">
      <div className="col-lg-5 wow fadeInUp" data-wow-delay="0.3s">
        <TestimonialImages />
      </div>
      <div className="col-lg-7 wow fadeInUp" data-wow-delay="0.5s">
        <TestimonialCarousel />
      </div>
    </div>
  </div>
);

const TestimonialImages = () => (
  <div className="testimonial-img">
    {[1, 2, 3, 4].map((num) => (
      <div key={num} className="animated flip infinite">
        <img className="img-fluid" src={`img/testimonial-${num}.jpg`} alt={`Testimonial ${num}`} />
      </div>
    ))}
  </div>
);

const TestimonialCarousel = () => (
  <Swiper
    modules={[Navigation, Autoplay]}
    spaceBetween={20}
    slidesPerView={1}
    navigation
    autoplay={{ delay: 4000 }}
    loop
  >
    {testimonialsData.map((testimonial, index) => (
      <SwiperSlide key={index}>
        <TestimonialItem {...testimonial} />
      </SwiperSlide>
    ))}
  </Swiper>
);

const TestimonialItem = ({ img, name, profession, rating, text }) => (
  <div className="testimonial-item">
    <div className="d-flex align-items-center mb-4">
      <img className="img-fluid" src={img} alt={name} />
      <div className="ms-3">
        <div className="mb-2">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`far fa-star ${i < rating ? 'text-primary' : ''}`}></i>
          ))}
        </div>
        <h5 className="text-uppercase">{name}</h5>
        <span>{profession}</span>
      </div>
    </div>
    <p className="fs-5">{text}</p>
  </div>
);

const Newsletter = () => (
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
);

// Data
const servicesData = [
  {
    imgSrc: "/img/service-1.jpg",
    title: "Metal Works",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-2.jpg",
    title: "Steel Welding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-3.jpg",
    title: "Pipe Welding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-4.jpg",
    title: "Custom Welding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-5.jpg",
    title: "Machine Repair",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-6.jpg",
    title: "Fabrication",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
   {
    imgSrc: "/img/service-7.jpg",
    title: "Aluminum Welding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    imgSrc: "/img/service-8.jpg",
    title: "Industrial Welding",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  }
  // Add all 8 services here
];

const testimonialsData = [
  {
    img: "/img/testimonial-1.jpg",
    name: "James Anderson",
    profession: "Construction Manager",
    rating: 5,
    text: "Their welding team did an outstanding job on our high-rise project. Strong, precise, and delivered on time. I’ll definitely hire them again."
  },
  {
    img: "/img/testimonial-2.jpg",
    name: "Maria Rodriguez",
    profession: "Architect",
    rating: 4,
    text: "I needed custom metal fabrication for a client’s design, and they exceeded expectations. Excellent craftsmanship and attention to detail."
  },
  {
    img: "/img/testimonial-3.jpg",
    name: "Michael Johnson",
    profession: "Factory Owner",
    rating: 5,
    text: "Our steel machinery broke down, and their welding repair got us back in operation within hours. Very reliable and skilled welders."
  },
  {
    img: "/img/testimonial-4.jpg",
    name: "Sarah Thompson",
    profession: "Homeowner",
    rating: 5,
    text: "I hired them for a custom gate and railing project. The results were stunning and durable. Friends and neighbors keep complimenting the work!"
  }

];

export default Service;