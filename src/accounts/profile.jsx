import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create configured axios instance
const createApiInstance = (navigate) => {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://welding-backend-vm1n.onrender.com',
  });

  // Request interceptor
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor
  api.interceptors.response.use(
    response => response,
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const api = createApiInstance(navigate);
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    education: '',
    skills: '',
    job: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    country: 'United States',
    about: '',
    profile_pic: null,
    profilePicPreview: null,
    social: {
      youtube: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    },
    notifications: {
      emailChange: false,
      passwordChange: false,
      weeklyNewsletter: false,
      productPromotions: false
    }
  });

  const logErrorToBackend = async (errorData) => {
    try {
      await api.post('/api/log-error/', {
        component: 'Profile',
        error: errorData.message || 'Unknown error',
        status: errorData.status,
        data: errorData.data,
        stack: errorData.stack,
        timestamp: new Date().toISOString()
      });
    } catch (loggingError) {
      console.error('Failed to log error to backend:', loggingError);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        console.log('Current token:', token);
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await api.get('/api/rest/v2/profile/');
        
        setProfileData(prev => ({
          ...prev,
          ...response.data,
          social: response.data.social || prev.social,
          notifications: response.data.notifications || prev.notifications,
          profilePicPreview: response.data.profile_pic 
            ? `${api.defaults.baseURL}${response.data.profile_pic}`
            : prev.profilePicPreview
        }));
        
      } catch (err) {
        console.error('Profile fetch error:', err);
        
        await logErrorToBackend({
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          stack: err.stack
        });

        if (err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.message || 'Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, api]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    
    // Append all profile data to formData
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === 'profileImage' && value instanceof File) {
        formData.append('profile_pic', value);
      } else if (key === 'social') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'notifications') {
        formData.append(key, JSON.stringify(value));
      } else if (!['profilePicPreview', 'profile_pic'].includes(key)) {
        formData.append(key, value);
      }
    });

    try {
      const response = await api.put('/api/rest/v2/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setProfileData(prev => ({
        ...prev,
        ...response.data,
        profilePicPreview: response.data.profile_pic 
          ? `${api.defaults.baseURL}${response.data.profile_pic}`
          : prev.profilePicPreview
      }));
      
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      
      // Log error to backend
      await logErrorToBackend({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
      });

      if (err.response?.status === 403) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Error updating profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ... [rest of the component remains the same] ...
};

export default Profile;