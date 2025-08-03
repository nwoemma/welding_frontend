import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaKey, FaLock } from 'react-icons/fa';

function PasswordResetConfirm() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get email from navigation state
  const email = location.state?.email || '';

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

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: Update password in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(user => user.email === email);

      if (userIndex === -1) {
        setError('Account not found');
        return;
      }
      
      users[userIndex].password = formData.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Password reset failed. Please try again.');
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
                <h2 className="text-center mb-0">Create New Password</h2>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <p className="text-muted mb-4">Enter a new password for {email}</p>

                <form onSubmit={handleSubmit}>
                  {/* New Password Field */}
                  <div className="mb-4">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        placeholder="••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                      <label htmlFor="newPassword" className="text-muted">
                        <FaKey className="me-2" />
                        New Password
                      </label>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                      <label htmlFor="confirmPassword" className="text-muted">
                        <FaLock className="me-2" />
                        Confirm Password
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : null}
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetConfirm;