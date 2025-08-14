import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [state, setState] = useState({
    isLoading: true,
    isSubmitting: false,
    error: null,
    success: false,
    jobDetails: null,
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      resume: null,
      cover_letter: '',
      experience: '',
      education: '',
      skills: '',
      source: 'website'
    },
    validationErrors: {}
  });

  // Fetch job details and pre-fill user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, profileRes] = await Promise.all([
          axios.get(`/api/jobs/${jobId}/`),
          user ? axios.get(`/api/profile/${user.id}/`) : Promise.resolve(null)
        ]);

        setState(prev => ({
          ...prev,
          isLoading: false,
          jobDetails: jobRes.data,
          formData: {
            ...prev.formData,
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: profileRes?.data?.phone || '',
            education: profileRes?.data?.education || '',
            skills: profileRes?.data?.skills || ''
          }
        }));

      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.response?.data?.error || 'Failed to load job details'
        }));
      }
    };

    fetchData();
  }, [jobId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      },
      validationErrors: {
        ...prev.validationErrors,
        [name]: null
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    let errors = {};
    if (!validTypes.includes(file.type)) {
      errors.resume = 'Only PDF or Word documents are allowed';
    }
    if (file.size > maxSize) {
      errors.resume = 'File size must be less than 5MB';
    }

    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        resume: errors.resume ? null : file
      },
      validationErrors: {
        ...prev.validationErrors,
        ...errors
      }
    }));
  };

  const validateForm = () => {
    const { formData } = state;
    const errors = {};
    const requiredFields = [
      'first_name', 'last_name', 'email', 'phone', 
      'experience', 'education', 'skills'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (!formData.resume) {
      errors.resume = 'Resume is required';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setState(prev => ({ ...prev, validationErrors: errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const formData = new FormData();
      Object.entries(state.formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      await axios.post(
        ` http://127.0.0.1:8000//api/rest/v2/apply_for_job/${jobId}/`,  // Updated endpoint
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setState(prev => ({ ...prev, success: true }));
      setTimeout(() => navigate('/my-applications'), 2000);

    } catch (err) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: err.response?.data?.error || 'Failed to submit application'
      }));
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning text-center my-5">
        <h4>You must be logged in to apply for jobs</h4>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/login', { state: { from: `/api/rest/v2/apply_for_job/${jobId}/` } })}
        >
          Login
        </button>
      </div>
    );
  }

  if (user.role !== 'welder') {
    return (
      <div className="alert alert-danger text-center my-5">
        <h4>Only welders can apply for jobs</h4>
        <p>Your account role is: {user.role}</p>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="alert alert-success text-center my-5">
        <h4>Application submitted successfully!</h4>
        <p>You will be redirected shortly...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">
                Apply for: {state.jobDetails?.title || 'Job'}
              </h2>
            </div>
            
            <div className="card-body">
              {state.error && (
                <div className="alert alert-danger">{state.error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Personal Information */}
                  <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">
                      First Name*
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        state.validationErrors.first_name ? 'is-invalid' : ''
                      }`}
                      id="first_name"
                      name="first_name"
                      value={state.formData.first_name}
                      onChange={handleChange}
                    />
                    {state.validationErrors.first_name && (
                      <div className="invalid-feedback">
                        {state.validationErrors.first_name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        state.validationErrors.last_name ? 'is-invalid' : ''
                      }`}
                      id="last_name"
                      name="last_name"
                      value={state.formData.last_name}
                      onChange={handleChange}
                    />
                    {state.validationErrors.last_name && (
                      <div className="invalid-feedback">
                        {state.validationErrors.last_name}
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email*
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        state.validationErrors.email ? 'is-invalid' : ''
                      }`}
                      id="email"
                      name="email"
                      value={state.formData.email}
                      onChange={handleChange}
                    />
                    {state.validationErrors.email && (
                      <div className="invalid-feedback">
                        {state.validationErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone*
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        state.validationErrors.phone ? 'is-invalid' : ''
                      }`}
                      id="phone"
                      name="phone"
                      value={state.formData.phone}
                      onChange={handleChange}
                    />
                    {state.validationErrors.phone && (
                      <div className="invalid-feedback">
                        {state.validationErrors.phone}
                      </div>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div className="col-12">
                    <label htmlFor="resume" className="form-label">
                      Resume* (PDF or Word)
                    </label>
                    <input
                      type="file"
                      className={`form-control ${
                        state.validationErrors.resume ? 'is-invalid' : ''
                      }`}
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {state.validationErrors.resume && (
                      <div className="invalid-feedback">
                        {state.validationErrors.resume}
                      </div>
                    )}
                    <small className="text-muted">
                      Maximum file size: 5MB
                    </small>
                  </div>

                  {/* Cover Letter */}
                  <div className="col-12">
                    <label htmlFor="cover_letter" className="form-label">
                      Cover Letter
                    </label>
                    <textarea
                      className="form-control"
                      id="cover_letter"
                      name="cover_letter"
                      rows="5"
                      value={state.formData.cover_letter}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Experience and Education */}
                  <div className="col-md-6">
                    <label htmlFor="experience" className="form-label">
                      Experience*
                    </label>
                    <textarea
                      className={`form-control ${
                        state.validationErrors.experience ? 'is-invalid' : ''
                      }`}
                      id="experience"
                      name="experience"
                      rows="3"
                      value={state.formData.experience}
                      onChange={handleChange}
                    />
                    {state.validationErrors.experience && (
                      <div className="invalid-feedback">
                        {state.validationErrors.experience}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="education" className="form-label">
                      Education*
                    </label>
                    <textarea
                      className={`form-control ${
                        state.validationErrors.education ? 'is-invalid' : ''
                      }`}
                      id="education"
                      name="education"
                      rows="3"
                      value={state.formData.education}
                      onChange={handleChange}
                    />
                    {state.validationErrors.education && (
                      <div className="invalid-feedback">
                        {state.validationErrors.education}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="col-12">
                    <label htmlFor="skills" className="form-label">
                      Skills* (comma separated)
                    </label>
                    <textarea
                      className={`form-control ${
                        state.validationErrors.skills ? 'is-invalid' : ''
                      }`}
                      id="skills"
                      name="skills"
                      rows="2"
                      value={state.formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., MIG welding, TIG welding, blueprint reading"
                    />
                    {state.validationErrors.skills && (
                      <div className="invalid-feedback">
                        {state.validationErrors.skills}
                      </div>
                    )}
                  </div>

                  {/* Source (hidden field) */}
                  <input type="hidden" name="source" value="website" />

                  {/* Submit Button */}
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={state.isSubmitting}
                    >
                      {state.isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;