import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './job.css';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    job_id: '',
    job_type: '',
    description: '',
    deadline: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobTypes = [
    'Welding',
    'Fabrication',
    'Installation',
    'Repair',
    'Inspection',
    'Other'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.job_id) newErrors.job_id = 'Job ID is required';
    if (!formData.job_type) newErrors.job_type = 'Job type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'Deadline cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://welding-backend-vm1n.onrender.com/api/rest/v2/job_create/', 
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('Job created successfully!');
      navigate('/job_list');
      setTimeout(() => navigate('/job_list'), 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          setErrors(error.response.data);
        } else {
          toast.error(error.response.data.message || 'Failed to create job');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-container">
      <div className="job-form-container">
        <h1 className="job-title">Create New Job</h1>
        <p className="job-subtitle">Fill in the details to create a new job</p>
        
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="job_id" className="form-label">
                Job ID *
              </label>
              <input
                type="text"
                id="job_id"
                name="job_id"
                value={formData.job_id}
                onChange={handleChange}
                className={`form-control ${errors.job_id ? 'border-red-500' : ''}`}
              />
              {errors.job_id && <span className="form-error">{errors.job_id}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="job_type" className="form-label">
                Job Type *
              </label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className={`form-control ${errors.job_type ? 'border-red-500' : ''}`}
              >
                <option value="">Select a job type</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.job_type && <span className="form-error">{errors.job_type}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="deadline" className="form-label">
                Deadline *
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className={`form-control ${errors.deadline ? 'border-red-500' : ''}`}
              />
              {errors.deadline && <span className="form-error">{errors.deadline}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`form-control form-textarea ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="loading-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="btn-icon" />
                  Create Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default JobCreate;