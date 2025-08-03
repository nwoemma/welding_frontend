import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from './axiosConfig'; // Import configured axios
// ... other imports remain the same ...

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('dashboard/');
        
        // Transform backend data to frontend format
        const transformedData = {
          user: response.data.user,
          notifications: response.data.notifications,
          unread_notifications: response.data.unread_notifications,
          role: response.data.role,
          is_admin: response.data.is_admin,
          stats: [
            { 
              label: 'Active Jobs', 
              value: response.data.job_count, 
              icon: FaClipboardList, 
              color: 'primary',
              trend: 'up', 
              change: '5' 
            },
            // ... other stats ...
          ],
          recent_jobs: response.data.recent_jobs,
          recent_materials: response.data.recent_materials,
          activity_chart: {
            labels: response.data.recent_jobs.map(job => 
              new Date(job.created_at).toLocaleDateString('en-US', { weekday: 'short' })
            ),
            datasets: [
              {
                label: 'Recent Jobs',
                data: response.data.recent_jobs.map((_, index) => index + 1),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              }
            ]
          }
        };

        setDashboardData(transformedData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Role-specific dashboard configuration
  const roleConfig = {
    admin: {
      tabs: [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'jobs', label: 'All Jobs', icon: FaClipboardList },
        { id: 'users', label: 'Users', icon: FaUsersCog },
        { id: 'reports', label: 'Reports', icon: FaFileAlt },
        { id: 'finance', label: 'Finance', icon: FaDollarSign }
      ],
      quickActions: [
        { label: 'Add User', icon: FaUser, path: '/users/add' },
        { label: 'Create Job', icon: FaPlus, path: '/jobs/create' },
        { label: 'Generate Report', icon: FaFileAlt, path: '/reports' }
      ]
    },
    client: {
      tabs: [
        { id: 'overview', label: 'My Projects', icon: FaChartLine },
        { id: 'jobs', label: 'My Jobs', icon: FaClipboardList },
        { id: 'requests', label: 'New Request', icon: FaPlus },
        { id: 'invoices', label: 'Invoices', icon: FaFileInvoiceDollar }
      ],
      quickActions: [
        { label: 'Request Job', icon: FaPlus, path: '/jobs/request' },
        { label: 'View Quotes', icon: FaDollarSign, path: '/quotes' },
        { label: 'Contact Support', icon: FaUserTie, path: '/support' }
      ]
    },
    welder: {
      tabs: [
        { id: 'overview', label: 'My Tasks', icon: FaChartLine },
        { id: 'jobs', label: 'Assigned Jobs', icon: FaClipboardList },
        { id: 'schedule', label: 'Schedule', icon: FaCalendarAlt },
        { id: 'materials', label: 'Materials', icon: FaWarehouse }
      ],
      quickActions: [
        { label: 'Log Work', icon: FaTools, path: '/work-log' },
        { label: 'Request Materials', icon: FaWarehouse, path: '/materials' },
        { label: 'Report Issue', icon: FaHardHat, path: '/issues' }
      ]
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const currentConfig = roleConfig[dashboardData.role] || roleConfig.welder;

  // Filter jobs based on search query
  const filteredJobs = dashboardData.recent_jobs?.filter(job =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column bg-light">
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            <FaFire className="text-warning me-2" />
            WeldTrack Pro
          </Link>
          
          <div className="d-flex align-items-center">
            <div className="dropdown me-3">
              <button className="btn btn-dark dropdown-toggle position-relative" type="button" id="notificationsDropdown" data-bs-toggle="dropdown">
                <FaBell />
                {dashboardData.unread_notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.unread_notifications}
                  </span>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">Notifications</h6></li>
                {dashboardData.notifications?.map(notification => (
                  <li key={notification.id}>
                    <Link className={`dropdown-item ${!notification.read ? 'fw-bold' : ''}`} to="#">
                      <div>{notification.message}</div>
                      <small className="text-muted">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                    </Link>
                  </li>
                ))}
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item text-center" to="/notifications">View all</Link></li>
              </ul>
            </div>
            
            <div className="dropdown">
              <button className="btn btn-dark dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown">
                <div className="me-2 d-none d-sm-block">{dashboardData.user?.username}</div>
                <div className="bg-primary rounded-circle p-2">
                  <FaUser className="text-white" />
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile"><FaUser className="me-2" /> Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings"><FaCog className="me-2" /> Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container-fluid p-0 flex-grow-1 d-flex">
        {/* Sidebar */}
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white shadow-sm" style={{width: '280px'}}>
          <ul className="nav nav-pills flex-column mb-auto">
            {currentConfig.tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button 
                  className={`nav-link d-flex align-items-center ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="me-2" /> {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <hr />
          <div className="mb-3">
            <h6 className="text-muted small">QUICK ACTIONS</h6>
            {currentConfig.quickActions.map(action => (
              <Link 
                key={action.label}
                to={action.path} 
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-start mb-2"
              >
                <action.icon className="me-2" /> {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="container-fluid p-4 overflow-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="row g-4">
              {/* Welcome Card */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mb-1">Welcome back, {dashboardData.user?.username}!</h4>
                        <p className="text-muted mb-0">
                          {dashboardData.role === 'admin' && 'Here are your system-wide metrics and activities.'}
                          {dashboardData.role === 'client' && 'Track your welding projects and requests.'}
                          {dashboardData.role === 'welder' && 'View your assigned tasks and schedule.'}
                        </p>
                      </div>
                      <div className="badge bg-primary bg-opacity-10 text-primary p-2">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              {dashboardData.stats.map((stat, index) => (
                <div className="col-md-6 col-lg-3" key={index}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted text-uppercase fs-7 fw-bold">{stat.label}</h6>
                          <h2 className="mb-0 fw-bold">{stat.value}</h2>
                          {stat.trend && (
                            <small className={`text-${stat.trend === 'up' ? 'success' : 'danger'}`}>
                              {stat.trend === 'up' ? '↑' : '↓'} {stat.change} from last week
                            </small>
                          )}
                        </div>
                        <div className={`bg-${stat.color || 'primary'}-bg-opacity-10 p-3 rounded-circle`}>
                          <stat.icon className={`text-${stat.color || 'primary'} fs-3`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Charts Section */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="mb-0">Recent Activity</h5>
                  </div>
                  <div className="card-body">
                    <Bar 
                      data={dashboardData.activity_chart} 
                      options={{ 
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Job Activity' }
                        }
                      }} 
                      height={300}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Jobs Section */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Jobs</h5>
                    <Link to="/jobs" className="btn btn-sm btn-outline-primary">View All</Link>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {dashboardData.recent_jobs?.map(job => (
                        <div key={job.id} className="list-group-item border-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{job.title}</h6>
                              <small className="text-muted">Client: {job.client}</small>
                            </div>
                            <span className={`badge bg-${
                              job.status === 'completed' ? 'success' : 
                              job.status === 'in_progress' ? 'primary' : 'secondary'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <small className="text-muted">
                              Started: {new Date(job.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {dashboardData.role === 'admin' ? 'All Jobs' : 'My Jobs'}
                </h5>
                <div className="d-flex">
                  <div className="input-group me-2" style={{width: '300px'}}>
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Link to="/jobs/create" className="btn btn-primary">
                    <FaPlus className="me-1" /> Create Job
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Client</th>
                        <th>Start Date</th>
                        <th>Deadline</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs?.map(job => (
                        <tr key={job.id}>
                          <td>{job.title}</td>
                          <td>{job.client}</td>
                          <td>{new Date(job.created_at).toLocaleDateString()}</td>
                          <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <span className={`badge bg-${
                              job.status === 'completed' ? 'success' : 
                              job.status === 'in_progress' ? 'primary' : 'secondary'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary me-2">
                                <FaEdit />
                              </Link>
                              <button className="btn btn-sm btn-outline-danger">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs */}
          {activeTab !== 'overview' && activeTab !== 'jobs' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  {currentConfig.tabs.find(tab => tab.id === activeTab)?.label}
                </h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  {activeTab} content would be loaded here based on {dashboardData.role} role.
                  <br />
                  This would typically show {
                    activeTab === 'users' ? 'user management' :
                    activeTab === 'reports' ? 'reports and analytics' :
                    activeTab === 'finance' ? 'financial data' :
                    activeTab === 'requests' ? 'job requests' :
                    activeTab === 'invoices' ? 'invoices' :
                    activeTab === 'schedule' ? 'work schedule' :
                    activeTab === 'materials' ? 'material inventory' : ''
                  }.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;