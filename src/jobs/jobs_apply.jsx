import React, { useState, useEffect } from 'react';
import './jobapp.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    source: '',
    consent: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (!token || !storedUserId) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!jobId) {
      toast.error('Invalid job listing');
      navigate('/jobs');
      return;
    }

    setUserId(storedUserId);
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
    
    if (!applicationData.consent) {
      toast.error('You must consent to data processing');
      return;
    }

    if (!userId || !jobId) {
      toast.error('Missing required information');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('first_name', applicationData.firstName);
    formData.append('last_name', applicationData.lastName);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    formData.append('cover_letter', applicationData.coverLetter);
    formData.append('experience', applicationData.experience);
    formData.append('education', applicationData.education);
    formData.append('skills', applicationData.skills);
    formData.append('source', applicationData.source);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://127.0.0.1:8000/api/apply_for_job/${userId}/${jobId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          }
        }
      );
      
      toast.success('Application submitted successfully!');
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data?.error || 'Validation error');
        } else if (error.response.status === 401) {
          toast.error('Please login to apply');
          navigate('/login');
        } else if (error.response.status === 403) {
          toast.error('Only welders can apply for jobs');
        } else if (error.response.status === 404) {
          toast.error('Job not found');
        } else {
          toast.error('Failed to submit application');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="job-application-container">
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
            <label htmlFor="resume">Upload Resume (PDF)*</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
            />
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
              <option value="">Select an option</option>
              <option value="job-board">Job Board (Indeed, LinkedIn, etc.)</option>
              <option value="company-website">Company Website</option>
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

        <button type="submit" className="submit-button">Submit Application</button>
      </form>
    </div>
  );
};

export default JobApplication;