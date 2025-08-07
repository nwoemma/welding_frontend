import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaAddressCard, FaUserTag } from 'react-icons/fa';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'client',
    address: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Client-side validation
    const validations = [
      [!formData.termsAgreed, 'You must agree to the terms and conditions'],
      [formData.password !== formData.confirmPassword, 'Passwords do not match'],
      [formData.password.length < 8, 'Password must be at least 8 characters'],
      [!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), 'Please enter a valid email address'],
      [!formData.phone.match(/^\+?\d{10,15}$/), 'Please enter a valid phone number'],
      [formData.full_name.length < 2, 'Full name must be at least 2 characters'],
      [formData.address.length < 5, 'Address must be more specific']
    ];

    for (const [condition, message] of validations) {
      if (condition) {
        setError(message);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        'https://welding-backend-vm1n.onrender.com/api/rest/v2/sign_up/',
        { 
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          role: formData.role
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      navigate('/login');
      
    } catch (err) {
      console.error("Registration error:", err.response?.data);

      let errorMessage = 'Registration failed. Please try again.';
      const newFieldErrors = {};

      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle different error formats from Django REST framework
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } 
        else if (errorData.detail) {
          errorMessage = errorData.detail;
        } 
        else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors.join(' ') 
            : errorData.non_field_errors;
        } 
        else {
          // Process field-specific errors
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              newFieldErrors[field] = messages.join(' ');
            } else if (typeof messages === 'string') {
              newFieldErrors[field] = messages;
            } else if (typeof messages === 'object') {
              // Handle nested errors
              newFieldErrors[field] = Object.values(messages).join(' ');
            }
          }
          
          // If no field errors were found but we have data, show it
          if (Object.keys(newFieldErrors).length === 0) {
            errorMessage = JSON.stringify(errorData);
          }
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (err.request) {
        errorMessage = 'No response from server. Check your network connection.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
      setFieldErrors(newFieldErrors);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get error class and message for a field
  const getFieldError = (fieldName) => {
    return {
      className: fieldErrors[fieldName] ? 'is-invalid' : '',
      message: fieldErrors[fieldName]
    };
  };

  return (
    <div className="d-flex align-items-center min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
              <div className="card-header bg-primary text-white py-4">
                <h2 className="text-center mb-0">Create Your Account</h2>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${getFieldError('full_name').className}`}
                          id="full_name"
                          name="full_name"
                          placeholder="John Doe"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          minLength="2"
                        />
                        <label htmlFor="full_name" className="text-muted">
                          <FaUser className="me-2" />
                          Full Name
                        </label>
                        {getFieldError('full_name').message && (
                          <div className="invalid-feedback">
                            {getFieldError('full_name').message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className={`form-control ${getFieldError('email').className}`}
                          id="email"
                          name="email"
                          placeholder="example@mail.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email" className="text-muted">
                          <FaEnvelope className="me-2" />
                          Email Address
                        </label>
                        {getFieldError('email').message && (
                          <div className="invalid-feedback">
                            {getFieldError('email').message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className={`form-control ${getFieldError('phone').className}`}
                          id="phone"
                          name="phone"
                          placeholder="+1234567890"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          pattern="[+]{0,1}[0-9]{10,15}"
                          title="Phone number should be 10-15 digits, optionally starting with +"
                        />
                        <label htmlFor="phone" className="text-muted">
                          <FaPhone className="me-2" />
                          Phone Number
                        </label>
                        {getFieldError('phone').message && (
                          <div className="invalid-feedback">
                            {getFieldError('phone').message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className={`form-select ${getFieldError('role').className}`}
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="client">Client</option>
                          <option value="welder">Vendor</option>
                        </select>
                        <label htmlFor="role" className="text-muted">
                          <FaUserTag className="me-2" />
                          Account Type
                        </label>
                        {getFieldError('role').message && (
                          <div className="invalid-feedback">
                            {getFieldError('role').message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <textarea
                        className={`form-control ${getFieldError('address').className}`}
                        id="address"
                        name="address"
                        placeholder="123 Main St, City, Country"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ height: '100px' }}
                      />
                      <label htmlFor="address" className="text-muted">
                        <FaAddressCard className="me-2" />
                        Full Address
                      </label>
                      {getFieldError('address').message && (
                        <div className="invalid-feedback">
                          {getFieldError('address').message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="password"
                          className={`form-control ${getFieldError('password').className}`}
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <label htmlFor="password" className="text-muted">
                          <FaLock className="me-2" />
                          Password
                        </label>
                        {getFieldError('password').message && (
                          <div className="invalid-feedback">
                            {getFieldError('password').message}
                          </div>
                        )}
                        <div className="form-text">Minimum 8 characters</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="password"
                          className={`form-control ${getFieldError('confirmPassword').className}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          minLength="8"
                        />
                        <label htmlFor="confirmPassword" className="text-muted">
                          <FaLock className="me-2" />
                          Confirm Password
                        </label>
                        {getFieldError('confirmPassword').message && (
                          <div className="invalid-feedback">
                            {getFieldError('confirmPassword').message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className={`form-check-input ${error && !formData.termsAgreed ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="termsAgreed"
                      name="termsAgreed"
                      checked={formData.termsAgreed}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="termsAgreed">
                      I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                    </label>
                    {error && !formData.termsAgreed && (
                      <div className="invalid-feedback">
                        You must agree to the terms and conditions
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : 'Register Now'}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;