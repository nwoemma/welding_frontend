import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios'; // Make sure axios is imported

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'https://welding-backend-vm1n.onrender.com/api/rest/v2/sign_in/',
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Save token if returned
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        console.log('Token stored:', localStorage.getItem('token'));
        navigate('/dashboard');
      } else {
        setError('Login failed: No token received.');
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
        console.log.error('Login error:', err.response.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
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
                <h2 className="text-center mb-0">Login to Your Account</h2>
              </div>
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
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

                  <div className="mb-4">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="password" className="text-muted">
                        <FaLock className="me-2" />
                        Password
                      </label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                      />
                      <label className="form-check-label text-muted" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link to="/password_reset" className="text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Logging in...
                      </>
                    ) : 'Login'}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-decoration-none fw-bold">
                        Register
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

export default Login;
