import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    followers: '0',
    following: '0',
    friends: '0',
    profileImage: null,
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

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get('http://127.0.0.1:8000/api/rest/v2/profile/', {
          headers: { Authorization: `Token ${token}` }
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
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchProfileData();
    } else {
      setError('Authentication token not found');
      setIsLoading(false);
    }
  }, [token]); // Only re-run if token changes

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
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    
    // Append all profile data to formData
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === 'profileImage' && value) {
        // Handle file upload if profileImage is a File object
        if (value instanceof File) {
          formData.append('profile_pic', value);
        }
      } else if (typeof value === 'object') {
        // Handle nested objects
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.put('http://127.0.0.1:8000/api/rest/v2/profile/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update with the returned data
      setProfileData(prev => ({
        ...prev,
        ...response.data
      }));
      
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile. Please try again.');
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
                    {/* <ul className="list-group list-group-flush mb-4">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <h6 className="m-0">Followers</h6>
                        <span>{profileData.followers}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <h6 className="m-0">Following</h6>
                        <span>{profileData.following}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <h6 className="m-0">Colleagues</h6>
                        <span>{profileData.friends}</span>
                      </li>
                    </ul> */}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">Social Accounts</div>
                  {/* <div className="card-body">
                    <a href={profileData.social.youtube || '#'} className="d-inline-block bg-dark link-light lh-1 p-2 rounded">
                      <i className="bi bi-youtube"></i>
                    </a>
                    <a href={profileData.social.twitter || '#'} className="d-inline-block bg-dark link-light lh-1 p-2 rounded">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href={profileData.social.facebook || '#'} className="d-inline-block bg-dark link-light lh-1 p-2 rounded">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href={profileData.social.linkedin || '#'} className="d-inline-block bg-dark link-light lh-1 p-2 rounded">
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </div> */}
                </div>
              </div>
              <div className="col-12">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-header text-bg-primary">About Me</div>
                  <div className="card-body">
                    {/* <ul className="list-group list-group-flush mb-0">
                      <li className="list-group-item">
                        <h6 className="mb-1">
                          <span className="bi bi-mortarboard-fill me-2"></span>
                          Education
                        </h6>
                        <span>{profileData.education || 'Not specified'}</span>
                      </li>
                      <li className="list-group-item">
                        <h6 className="mb-1">
                          <span className="bi bi-geo-alt-fill me-2"></span>
                          Location
                        </h6>
                        <span>{profileData.address || 'Not specified'}</span>
                      </li>
                      <li className="list-group-item">
                        <h6 className="mb-1">
                          <span className="bi bi-building-fill-gear me-2"></span>
                          Company
                        </h6>
                        <span>{profileData.company || 'Not specified'}</span>
                      </li>
                    </ul> */}
                  </div>
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
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">First Name</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.first_name || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Last Name</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.last_name || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Education</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.education || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Address</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.address || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Country</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.country || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Job</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.job || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Company</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.company || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Phone</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.phone || '-'}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Email</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{profileData.email || '-'}</div>
                        </div>
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
                                {profileData.profileImage ? (
                                  <img 
                                    src={profileData.profileImage} 
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
                          <div className="col-12 col-md-6">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="firstName"
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="lastName"
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="education" className="form-label">Education/Certifications</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="education"
                              name="education"
                              value={profileData.education}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="skills" className="form-label">Skills (comma separated)</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="skills"
                              name="skills"
                              value={profileData.skills}
                              onChange={handleInputChange}
                              placeholder="MIG, TIG, Stick, Plasma Cutting"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="job" className="form-label">Job Title</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="job"
                              name="job"
                              value={profileData.job}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="company" className="form-label">Company</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="company"
                              name="company"
                              value={profileData.company}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              id="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="address"
                              name="address"
                              value={profileData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="country" className="form-label">Country</label>
                            <select 
                              className="form-select" 
                              id="country"
                              name="country"
                              value={profileData.country}
                              onChange={handleInputChange}
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                              <option value="Germany">Germany</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="youtube" className="form-label">YouTube</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              id="youtube"
                              name="social.youtube"
                              value={profileData.social.youtube}
                              onChange={handleInputChange}
                              placeholder="https://youtube.com/yourchannel"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="twitter" className="form-label">Twitter</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              id="twitter"
                              name="social.twitter"
                              value={profileData.social.twitter}
                              onChange={handleInputChange}
                              placeholder="https://twitter.com/yourhandle"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="facebook" className="form-label">Facebook</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              id="facebook"
                              name="social.facebook"
                              value={profileData.social.facebook}
                              onChange={handleInputChange}
                              placeholder="https://facebook.com/yourprofile"
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label htmlFor="linkedin" className="form-label">LinkedIn</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              id="linkedin"
                              name="social.linkedin"
                              value={profileData.social.linkedin}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </div>
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
                            <button type="submit" className="btn btn-primary">Save Profile</button>
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
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="emailChange"
                                name="notifications.emailChange"
                                checked={profileData.notifications.emailChange}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="emailChange">
                                Email Changed Notifications
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="passwordChange"
                                name="notifications.passwordChange"
                                checked={profileData.notifications.passwordChange}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="passwordChange">
                                Security Alerts
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="weeklyNewsletter"
                                name="notifications.weeklyNewsletter"
                                checked={profileData.notifications.weeklyNewsletter}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="weeklyNewsletter">
                                Weekly Industry News
                              </label>
                            </div>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="productPromotions"
                                name="notifications.productPromotions"
                                checked={profileData.notifications.productPromotions}
                                onChange={handleInputChange}
                              />
                              <label className="form-check-label" htmlFor="productPromotions">
                                Product Promotions
                              </label>
                            </div>
                          </div>
                        </fieldset>
                        <div className="row">
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary mt-4">Save Preferences</button>
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