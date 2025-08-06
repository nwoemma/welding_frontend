import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFire, FaChartLine, FaClipboardList, FaCalendarAlt,
  FaWarehouse, FaPlus, FaSearch, FaUser, FaBell, FaCog,
  FaTools, FaFileInvoiceDollar, FaUsersCog, FaDollarSign
} from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Dropdown } from 'react-bootstrap';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = 'https://welding-backend-vm1n.onrender.com/api/rest/v2/dashboard/';

function Dashboard() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    role: 'welder'
  });
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    notifications: [],
    recent_users: [],
    recent_jobs: [],
    upcoming_tasks: [],
    unread_notifications: 0,
    activity_chart: null,
    project_timeline: null,
    productivity_chart: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token missing');

    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Token ${token}` },
    });
    
    console.log('API Response:', response.data); // Debugging

    // Safely transform the API response
    const transformedData = {
      stats: [
        { label: 'Jobs', value: response.data.job_count || 0 },
        { label: 'Materials', value: response.data.material_count || 0 },
        { label: 'Tasks', value: response.data.task_count || 0 },
        { label: 'Notifications', value: response.data.notification_count || 0 }
      ],
      notifications: Array.isArray(response.data.notifications) ? response.data.notifications : [],
      recent_users: Array.isArray(response.data.recent_users) ? response.data.recent_users : [],
      recent_jobs: Array.isArray(response.data.recent_jobs) ? response.data.recent_jobs.slice(0, 5) : [],
      upcoming_tasks: Array.isArray(response.data.upcoming_tasks) ? response.data.upcoming_tasks : [],
      unread_notifications: response.data.unread_notifications || 0,
      activity_chart: response.data.activity_chart || null,
      project_timeline: response.data.project_timeline || null,
      productivity_chart: response.data.productivity_chart || null
    };

    setUserData({
      first_name: response.data.user?.first_name || '',
      last_name: response.data.user?.last_name || '',
      role: response.data.user?.role || 'welder'
    });
    
    setDashboardData(transformedData);
  } catch (err) {
    console.error('Dashboard error:', err);
    setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
    if (err.response?.status === 401) {
      navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [navigate]);

  const roleConfig = {
    admin: {
      tabs: [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'jobs', label: 'All Jobs', icon: FaClipboardList },
        { id: 'users', label: 'Users', icon: FaUsersCog },
        { id: 'reports', label: 'Reports', icon: FaFileInvoiceDollar }
      ],
      quickActions: [
        { label: 'Add User', icon: FaUser, path: '/users/add' },
        { label: 'Create Job', icon: FaPlus, path: '/jobs/create' },
        { label: 'Generate Report', icon: FaFileInvoiceDollar, path: '/reports' }
      ]
    },
    client: {
      tabs: [
        { id: 'overview', label: 'My Projects', icon: FaChartLine },
        { id: 'jobs', label: 'My Jobs', icon: FaClipboardList },                                                                                                                                                       
        { id: 'requests', label: 'New Request', icon: FaPlus },
        { id: 'invoices', label: 'Invoices', icon: FaDollarSign }
      ],
      quickActions: [
        { label: 'Apply for a Job', icon: FaPlus, path: '/jobs/request' },
        { label: 'View Quotes', icon: FaDollarSign, path: '/quotes' },
        { label: 'Contact Support', icon: FaUser, path: '/support' }
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
        { label: 'Report Issue', icon: FaTools, path: '/issues' }
      ]
    }
  };

  const renderChart = (chartData) => {
  if (!chartData || !chartData.data || !chartData.data.datasets) {
    return (
      <div className="text-muted p-4">
        <FaChartLine className="fs-1 mb-2" />
        <p>No chart data available</p>
      </div>
    );
  }

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  switch (chartData.type) {
    case 'bar':
      return <Bar data={chartData.data} options={{ ...commonOptions, ...chartData.options }} />;
    case 'line':
      return <Line data={chartData.data} options={{ ...commonOptions, ...chartData.options }} />;
    case 'pie':
      return <Pie data={chartData.data} options={{ ...commonOptions, ...chartData.options }} />;
    default:
      return (
        <div className="text-muted p-4">
          <FaExclamationTriangle className="fs-1 mb-2" />
          <p>Unsupported chart type</p>
        </div>
      );
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
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Dashboard</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentConfig = roleConfig[userData.role] || roleConfig.welder;

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
            {/* Notifications Dropdown */}
            <Dropdown className="me-3">
              <Dropdown.Toggle 
                variant="dark" 
                className="position-relative"
                id="dropdown-notifications"
              >
                <FaBell />
                {dashboardData.unread_notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {dashboardData.unread_notifications}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>Notifications</Dropdown.Header>
                {dashboardData.notifications.length > 0 ? (
                  dashboardData.notifications.map(notification => (
                    <Dropdown.Item 
                      key={notification.id}
                      as={Link}
                      to="#"
                      className={!notification.read ? 'fw-bold' : ''}
                    >
                      <div>{notification.message}</div>
                      <small className="text-muted">{notification.time}</small>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No notifications</Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/notifications" className="text-center">
                  View all
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-profile">
                <div className="d-flex align-items-center">
                  <div className="me-2 d-none d-sm-block">
                    {userData.first_name} {userData.last_name}
                  </div>
                  <div className="bg-primary rounded-circle p-2">
                    <FaUser className="text-white" />
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings">
                  <FaCog className="me-2" /> Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
          {activeTab === 'overview' && (
            <div className="row g-4">
              {/* Welcome Card */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mb-1">Welcome back, {userData.first_name}!</h4>
                        <p className="text-muted mb-0">
                          {userData.role === 'admin' && 'Here are your system-wide metrics and activities.'}
                          {userData.role === 'client' && 'Track your welding projects and requests.'}
                          {userData.role === 'welder' && 'View your assigned tasks and schedule.'}
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
              {dashboardData.stats.length > 0 ? (
                dashboardData.stats.map((stat, index) => (
                  <div className="col-md-6 col-lg-3" key={index}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-muted text-uppercase fs-7 fw-bold">{stat.label}</h6>
                            <h2 className="mb-0 fw-bold">{stat.value}</h2>
                            {stat.trend && (
                              <small className={`text-${stat.trend === 'up' ? 'success' : 'danger'}`}>
                                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                              </small>
                            )}
                          </div>
                          <div className={`bg-primary bg-opacity-10 p-3 rounded-circle`}>
                            <FaChartLine className="text-primary fs-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-info">No statistics available</div>
                </div>
              )}

              {/* Role-specific content */}
              {userData.role === 'admin' && (
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">System Activity</h5>
                    </div>
                    <div className="card-body">
                      {renderChart(dashboardData.activity_chart)}
                    </div>
                  </div>
                </div>
              )}

              {userData.role === 'client' && (
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">Project Timeline</h5>
                    </div>
                    <div className="card-body">
                      {renderChart(dashboardData.project_timeline)}
                    </div>
                  </div>
                </div>
              )}

              {userData.role === 'welder' && (
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">My Productivity</h5>
                    </div>
                    <div className="card-body">
                      {renderChart(dashboardData.productivity_chart)}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Items */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white border-0">
                    <h5 className="mb-0">
                      {userData.role === 'admin' && 'Recent Users'}
                      {userData.role === 'client' && 'Recent Jobs'}
                      {userData.role === 'welder' && 'Upcoming Tasks'}
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {userData.role === 'admin' && (
                        dashboardData.recent_users.length > 0 ? (
                          dashboardData.recent_users.map(user => (
                            <div key={user.id} className="list-group-item border-0">
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                    <FaUser className="text-primary" />
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="mb-1">{user.first_name} {user.last_name}</h6>
                                  <small className="text-muted">{user.role} • Joined {user.date_joined}</small>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="list-group-item border-0 text-muted">No recent users</div>
                        )
                      )}

                      {userData.role === 'client' && (
                        dashboardData.recent_jobs.length > 0 ? (
                          dashboardData.recent_jobs.map(job => (
                            <div key={job.id} className="list-group-item border-0">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <h6 className="mb-1">{job.job_id}</h6>
                                  <small className="text-muted">{job.status}</small>
                                </div>
                                <span className={`badge bg-${job.status === 'completed' ? 'success' : 'primary'}`}>
                                  {job.deadline}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="list-group-item border-0 text-muted">No recent jobs</div>
                        )
                      )}

                      {userData.role === 'welder' && (
                        dashboardData.upcoming_tasks.length > 0 ? (
                          dashboardData.upcoming_tasks.map(task => (
                            <div key={task.id} className="list-group-item border-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{task.description}</h6>
                                  <small className="text-muted">Due: {task.due_date}</small>
                                </div>
                                <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="list-group-item border-0 text-muted">No upcoming tasks</div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== 'overview' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h4>{currentConfig.tabs.find(tab => tab.id === activeTab)?.label}</h4>
                <div className="alert alert-info mt-3">
                  {activeTab} content would be loaded here based on {userData.role} role.
                  <br />
                  <small className="text-muted">This is a placeholder for the {activeTab} tab functionality.</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;