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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.termsAgreed) {
      setError('You must agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('https://welding-backend-vm1n.onrender.com/api/rest/v2/sign_up/', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role
      });

      console.log(res.data);
      navigate(formData.role === 'admin' ? '/admin' : '/login');
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
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
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
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
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="tel"
                          className="form-control"
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="client">Client</option>
                          {/* <option value="admin">Administrator</option>
                          <option value="manager">Manager</option> */}
                          <option value="vendor">Vendor</option>
                        </select>
                        <label htmlFor="role" className="text-muted">
                          <FaUserTag className="me-2" />
                          Account Type
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
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
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control"
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
                      </div>
                      <div className="form-text">Minimum 8 characters</div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control"
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
                      </div>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
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