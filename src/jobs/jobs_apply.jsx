import React, { useState, useEffect } from 'react';
import './jobapp.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [applicationData, setApplicationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    resume: null,
    coverLetter: '',
    experience: '',
    education: '',
    skills: '',
    source: 'website',
    consent: false
  });

  // Validate token and permissions on component mount
  useEffect(() => {
    const validateTokenAndPermissions = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        toast.error('Please login to apply for jobs');
        navigate('/login');
        return;
      }

      try {
        // Verify token validity
        await axios.get(
          'https://welding-backend-vm1n.onrender.com/api/auth/verify_token/',
          { headers: { 'Authorization': `Token ${token}` } }
        );

        // Verify user role is welder
        const userResponse = await axios.get(
          `https://welding-backend-vm1n.onrender.com/api/users/${userId}/`,
          { headers: { 'Authorization': `Token ${token}` } }
        );

        if (userResponse.data.role !== 'welder') {
          toast.error('Only welders can apply for jobs');
          navigate('/jobs');
          return;
        }

        setIsTokenValid(true);
        
        if (!jobId) {
          toast.error('Invalid job listing');
          navigate('/jobs');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    };

    validateTokenAndPermissions();
  }, [jobId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isTokenValid) {
      toast.error('Please login to apply');
      return;
    }

    if (!applicationData.consent) {
      toast.error('You must consent to data processing');
      return;
    }

    const requiredFields = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      position: 'Position',
      resume: 'Resume',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !applicationData[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('first_name', applicationData.firstName);
    formData.append('last_name', applicationData.lastName);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    formData.append('resume', applicationData.resume);
    formData.append('cover_letter', applicationData.coverLetter);
    formData.append('experience', applicationData.experience);
    formData.append('education', applicationData.education);
    formData.append('skills', applicationData.skills);
    formData.append('source', applicationData.source);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await axios.post(
        `https://welding-backend-vm1n.onrender.com/api/apply_for_job/${userId}/${jobId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          }
        }
      );
      
      toast.success(response.data.message || 'Application submitted successfully!');
      
      // Reset form after successful submission
      setApplicationData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        resume: null,
        coverLetter: '',
        experience: '',
        education: '',
        skills: '',
        source: 'website',
        consent: false
      });

      // Redirect to jobs page after 2 seconds
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (error) {
      console.error('Application error:', error);
      
      let errorMessage = 'Failed to submit application';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.error || 'Validation error';
            break;
          case 401:
          case 403:
            errorMessage = error.response.data?.error || 'Authentication failed';
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login');
            break;
          case 404:
            errorMessage = error.response.data?.error || 'Job not found';
            navigate('/jobs');
            break;
          default:
            errorMessage = error.response.data?.error || 'Application failed';
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="job-application-container">
        <div className="loading-spinner">
          <ArrowPathIcon className="animate-spin" />
          <p>Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-application-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1>Job Application</h1>
      <p>Please fill out the form below to apply for the position.</p>
      
      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={applicationData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={applicationData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={applicationData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={applicationData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Position Information</h2>
          <div className="form-group">
            <label htmlFor="position">Position Applying For*</label>
            <input
              type="text"
              id="position"
              name="position"
              value={applicationData.position}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF, DOC, DOCX)*</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
            />
            {applicationData.resume && (
              <p className="file-info">Selected file: {applicationData.resume.name}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={applicationData.coverLetter}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us why you'd be a great fit for this position..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Qualifications</h2>
          <div className="form-group">
            <label htmlFor="experience">Relevant Work Experience*</label>
            <textarea
              id="experience"
              name="experience"
              value={applicationData.experience}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe your relevant work experience..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="education">Education*</label>
            <textarea
              id="education"
              name="education"
              value={applicationData.education}
              onChange={handleChange}
              rows="3"
              required
              placeholder="List your educational background..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="skills">Key Skills*</label>
            <textarea
              id="skills"
              name="skills"
              value={applicationData.skills}
              onChange={handleChange}
              rows="3"
              required
              placeholder="List your relevant skills..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label htmlFor="source">How did you hear about this position?</label>
            <select
              id="source"
              name="source"
              value={applicationData.source}
              onChange={handleChange}
            >
              <option value="website">Company Website</option>
              <option value="job-board">Job Board (Indeed, LinkedIn, etc.)</option>
              <option value="referral">Employee Referral</option>
              <option value="social-media">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={applicationData.consent}
              onChange={handleChange}
              required
            />
            <label htmlFor="consent">
              I consent to the processing of my personal data for the purpose of this application.*
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobApplication;