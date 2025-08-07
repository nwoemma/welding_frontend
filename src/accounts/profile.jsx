import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://welding-backend-vm1n.onrender.com';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get(`${API_BASE_URL}/api/rest/v2/profile/`, {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setProfileData(prev => ({
          ...prev,
          ...response.data,
          social: {
            ...prev.social,
            ...(response.data.social || {})
          },
          notifications: {
            ...prev.notifications,
            ...(response.data.notifications || {})
          }
        }));
      } catch (err) {
        console.error('Error fetching profile data:', err);
        
        if (err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.detail || 'Failed to load profile data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, API_BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicPreview: reader.result,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      } else if (key !== 'profilePicPreview') {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.put(`${API_BASE_URL}/api/rest/v2/profile/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update with the returned data
      setProfileData(prev => ({
        ...prev,
        ...response.data,
        profilePicPreview: response.data.profile_pic || prev.profilePicPreview
      }));
      
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
        {error.includes('Session expired') && (
          <button 
            className="btn btn-link p-0 ms-2"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="bg-light py-3 py-md-5 py-xl-8">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <h2 className="mb-4 display-5 text-center">Your Profile</h2>
            <p className="text-secondary text-center lead fs-4 mb-5">
              Customize your welding professional profile
            </p>
            <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row gy-4 gy-lg-0">
          <div className="col-12 col-lg-4 col-xl-3">
            <div className="row gy-4">
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">
                    Welcome, {profileData.first_name || 'Welder'} {profileData.last_name}
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      {profileData.profilePicPreview ? (
                        <img 
                          src={profileData.profilePicPreview} 
                          className="img-fluid rounded-circle" 
                          alt="Profile Preview" 
                          style={{width: '150px', height: '150px', objectFit: 'cover'}}
                        />
                      ) : profileData.profile_pic ? (
                        <img 
                          src={profileData.profile_pic} 
                          className="img-fluid rounded-circle" 
                          alt="Profile" 
                          style={{width: '150px', height: '150px', objectFit: 'cover'}}
                        />
                      ) : (
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" 
                          style={{width: '150px', height: '150px', margin: '0 auto'}}>
                          <i className="bi bi-person-fill" style={{fontSize: '3rem'}}></i>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="form-control mt-2"
                      />
                    </div>
                    <h5 className="text-center mb-1">
                      {profileData.first_name} {profileData.last_name || ''}
                    </h5>
                    <p className="text-center text-secondary mb-4">
                      {profileData.job || 'Welding Professional'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">Social Accounts</div>
                </div>
              </div>
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">About Me</div>
                </div>
              </div>
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">Skills</div>
                  <div className="card-body">
                    {profileData.skills ? (
                      profileData.skills.split(',').map((skill, index) => (
                        <span key={index} className="badge text-bg-primary me-1 mb-1">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <p>No skills added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8 col-xl-9">
            <div className="card widget-card border-light shadow-sm">
              <div className="card-body p-4">
                <ul className="nav nav-tabs" id="profileTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => handleTabChange('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                      onClick={() => handleTabChange('profile')}
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                      onClick={() => handleTabChange('notifications')}
                    >
                      Notifications
                    </button>
                  </li>
                </ul>
                <div className="tab-content pt-4">
                  {activeTab === 'overview' && (
                    <div className="tab-pane fade show active">
                      <h5 className="mb-3">About</h5>
                      <p className="lead mb-3">
                        {profileData.about || 'No about information provided yet.'}
                      </p>
                      <h5 className="mb-3">Profile Details</h5>
                      <div className="row g-0">
                        {[
                          ['First Name', profileData.first_name],
                          ['Last Name', profileData.last_name],
                          ['Education', profileData.education],
                          ['Address', profileData.address],
                          ['Country', profileData.country],
                          ['Job', profileData.job],
                          ['Company', profileData.company],
                          ['Phone', profileData.phone],
                          ['Email', profileData.email]
                        ].map(([label, value], index) => (
                          <React.Fragment key={index}>
                            <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                              <div className="p-2">{label}</div>
                            </div>
                            <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                              <div className="p-2">{value || '-'}</div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="tab-pane fade">
                      <form onSubmit={handleSubmit}>
                        <div className="row gy-3 gy-xxl-4">
                          <div className="col-12">
                            <div className="row gy-2">
                              <label className="col-12 form-label m-0">Profile Image</label>
                              <div className="col-12">
                                {profileData.profilePicPreview ? (
                                  <img 
                                    src={profileData.profilePicPreview} 
                                    className="img-fluid rounded" 
                                    alt="Profile" 
                                    style={{width: '200px', height: '200px', objectFit: 'cover'}}
                                  />
                                ) : (
                                  <div className="bg-secondary rounded d-flex align-items-center justify-content-center" 
                                      style={{width: '200px', height: '200px'}}>
                                    <i className="bi bi-person-fill" style={{fontSize: '3rem'}}></i>
                                  </div>
                                )}
                              </div>
                              <div className="col-12">
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleImageUpload}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          {[
                            ['firstName', 'First Name', 'text', profileData.first_name, true],
                            ['lastName', 'Last Name', 'text', profileData.last_name, true],
                            ['education', 'Education/Certifications', 'text', profileData.education],
                            ['skills', 'Skills (comma separated)', 'text', profileData.skills, false, "MIG, TIG, Stick, Plasma Cutting"],
                            ['job', 'Job Title', 'text', profileData.job],
                            ['company', 'Company', 'text', profileData.company],
                            ['phone', 'Phone', 'tel', profileData.phone],
                            ['email', 'Email', 'email', profileData.email, true],
                            ['address', 'Address', 'text', profileData.address],
                          ].map(([id, label, type, value, required, placeholder]) => (
                            <div className="col-12 col-md-6" key={id}>
                              <label htmlFor={id} className="form-label">{label}</label>
                              <input 
                                type={type} 
                                className="form-control" 
                                id={id}
                                name={id}
                                value={value}
                                onChange={handleInputChange}
                                required={required}
                                placeholder={placeholder}
                              />
                            </div>
                          ))}
                          <div className="col-12 col-md-6">
                            <label htmlFor="country" className="form-label">Country</label>
                            <select 
                              className="form-select" 
                              id="country"
                              name="country"
                              value={profileData.country}
                              onChange={handleInputChange}
                            >
                              {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Other'].map(country => (
                                <option key={country} value={country}>{country}</option>
                              ))}
                            </select>
                          </div>
                          {Object.entries({
                            youtube: 'https://youtube.com/yourchannel',
                            twitter: 'https://twitter.com/yourhandle',
                            facebook: 'https://facebook.com/yourprofile',
                            linkedin: 'https://linkedin.com/in/yourprofile'
                          }).map(([platform, placeholder]) => (
                            <div className="col-12 col-md-6" key={platform}>
                              <label htmlFor={platform} className="form-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                              <input 
                                type="url" 
                                className="form-control" 
                                id={platform}
                                name={`social.${platform}`}
                                value={profileData.social[platform]}
                                onChange={handleInputChange}
                                placeholder={placeholder}
                              />
                            </div>
                          ))}
                          <div className="col-12">
                            <label htmlFor="about" className="form-label">About</label>
                            <textarea 
                              className="form-control" 
                              id="about"
                              name="about"
                              value={profileData.about}
                              onChange={handleInputChange}
                              rows="5"
                            ></textarea>
                          </div>
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                              {isLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="tab-pane fade">
                      <form onSubmit={handleSubmit}>
                        <fieldset className="row gy-3 gy-md-0">
                          <legend className="col-form-label col-12 col-md-3 col-xl-2">Notification Preferences</legend>
                          <div className="col-12 col-md-9 col-xl-10">
                            {Object.entries({
                              emailChange: 'Email Changed Notifications',
                              passwordChange: 'Security Alerts',
                              weeklyNewsletter: 'Weekly Industry News',
                              productPromotions: 'Product Promotions'
                            }).map(([id, label]) => (
                              <div className="form-check" key={id}>
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id={id}
                                  name={`notifications.${id}`}
                                  checked={profileData.notifications[id]}
                                  onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor={id}>
                                  {label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                        <div className="row">
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary mt-4" disabled={isLoading}>
                              {isLoading ? 'Saving...' : 'Save Preferences'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;