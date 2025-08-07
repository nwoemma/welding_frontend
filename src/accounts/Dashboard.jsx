import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFire, FaChartLine, FaClipboardList, FaCalendarAlt,
  FaWarehouse, FaPlus, FaSearch, FaUser, FaBell, FaCog,
  FaTools, FaFileInvoiceDollar, FaUsersCog, FaDollarSign,
  FaBars, FaTimes, FaExclamationTriangle
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
import useDeviceDetect from '../hooks/useDeviceDetect';

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
  const { isAndroid } = useDeviceDetect();
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="text-muted p-3 text-center">
          <FaChartLine className="fs-3 mb-2" />
          <p className="small">No chart data available</p>
        </div>
      );
    }

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
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
          <div className="text-muted p-3 text-center">
            <FaExclamationTriangle className="fs-3 mb-2" />
            <p className="small">Unsupported chart type</p>
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
      {/* Top Navigation Bar with Android Dropdown Fixes */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 py-1">
        <div className="container-fluid">
          <div className="d-flex align-items-center w-100">
            <button 
              className="navbar-toggler me-2 border-0 p-1" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            
            <Link className="navbar-brand fw-bold text-truncate" to="/">
              <FaFire className="text-warning me-2" />
              <span className="d-none d-sm-inline">WeldTrack Pro</span>
              <span className="d-inline d-sm-none">WTP</span>
            </Link>

            <div className="d-flex ms-auto position-relative">
              {/* Notification Dropdown with Android Fix */}
              <Dropdown className={`me-2 ${isAndroid ? 'android-dropdown' : ''}`}>
                <Dropdown.Toggle variant="dark" className="position-relative p-1">
                  <FaBell size={18} />
                  {dashboardData.unread_notifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {dashboardData.unread_notifications > 9 ? '9+' : dashboardData.unread_notifications}
                    </span>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu 
                  align="end" 
                  className={`dropdown-menu-end ${isAndroid ? 'android-dropdown-menu' : 'position-absolute'}`}
                  style={{
                    zIndex: 1050,
                    ...(isAndroid && {
                      position: 'fixed',
                      marginTop: '5px',
                      right: '15px',
                      left: 'auto',
                      width: '280px'
                    })
                  }}
                >
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  {dashboardData.notifications.length > 0 ? (
                    dashboardData.notifications.map(notification => (
                      <Dropdown.Item 
                        key={notification.id}
                        as={Link}
                        to="#"
                        className={`${!notification.read ? 'fw-bold' : ''} p-2`}
                      >
                        <div className="small">{notification.message}</div>
                        <small className="text-muted">{notification.time}</small>
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled className="p-2">No notifications</Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/notifications" className="text-center p-2">
                    View all
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Profile Dropdown with Android Fix */}
              <Dropdown className={isAndroid ? 'android-dropdown' : ''}>
                <Dropdown.Toggle variant="dark" className="p-1">
                  <div className="bg-primary rounded-circle p-1">
                    <FaUser className="text-white" size={16} />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  align="end"
                  className={`dropdown-menu-end ${isAndroid ? 'android-dropdown-menu' : 'position-absolute'}`}
                  style={{
                    zIndex: 1050,
                    ...(isAndroid && {
                      position: 'fixed',
                      marginTop: '5px',
                      right: '15px',
                      left: 'auto'
                    })
                  }}
                >
                  <Dropdown.Item as={Link} to="/profile" className="p-2">
                    <FaUser className="me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings" className="p-2">
                    <FaCog className="me-2" /> Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="p-2"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid p-0 flex-grow-1 d-flex">
        {/* Sidebar - Mobile Friendly */}
        {sidebarOpen && (
          <div 
            className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 z-1" 
            onClick={() => setSidebarOpen(false)}
            style={{zIndex: 1040}}
          />
        )}
        <div 
          className={`d-flex flex-column flex-shrink-0 p-2 bg-white shadow-sm ${sidebarOpen ? 'position-fixed start-0 top-56 h-100 z-2' : 'd-none d-lg-flex'}`}
          style={{width: '260px', zIndex: 1045}}
        >
          <ul className="nav nav-pills flex-column mb-auto">
            {currentConfig.tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button 
                  className={`nav-link d-flex align-items-center p-2 ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                >
                  <tab.icon className="me-2 fs-5" /> 
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <hr className="my-2" />
          <div className="mb-2">
            <h6 className="text-muted small px-2 mb-2">QUICK ACTIONS</h6>
            {currentConfig.quickActions.map(action => (
              <Link 
                key={action.label}
                to={action.path} 
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-start mb-2 p-2"
                onClick={() => setSidebarOpen(false)}
              >
                <action.icon className="me-2" /> 
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="container-fluid p-2 overflow-auto">
          {activeTab === 'overview' && (
            <>
              {/* Welcome Card */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-3">
                  <div className="d-flex flex-column">
                    <h4 className="mb-1">Welcome back, {userData.first_name || 'User'}!</h4>
                    <p className="text-muted mb-2 small">
                      {userData.role === 'admin' && 'Manage system metrics and activities'}
                      {userData.role === 'client' && 'Track your welding projects and requests'}
                      {userData.role === 'welder' && 'View your assigned tasks and schedule'}
                    </p>
                    <div className="badge bg-primary bg-opacity-10 text-primary align-self-start">
                      {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row g-2 mb-3">
                {dashboardData.stats.map((stat, index) => (
                  <div className="col-6" key={index}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="text-muted text-uppercase small fw-bold mb-1">{stat.label}</h6>
                            <h4 className="mb-0 fw-bold">{stat.value}</h4>
                          </div>
                          <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                            <FaChartLine className="text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-header bg-white border-0 p-2">
                  <h5 className="mb-0">
                    {userData.role === 'admin' && 'System Activity'}
                    {userData.role === 'client' && 'Project Timeline'}
                    {userData.role === 'welder' && 'My Productivity'}
                  </h5>
                </div>
                <div className="card-body p-2" style={{height: '250px'}}>
                  {renderChart(
                    userData.role === 'admin' ? dashboardData.activity_chart :
                    userData.role === 'client' ? dashboardData.project_timeline :
                    dashboardData.productivity_chart
                  )}
                </div>
              </div>

              {/* Recent Items */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-2">
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
                          <div key={user.id} className="list-group-item border-0 p-2">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                  <FaUser className="text-primary" />
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-2">
                                <h6 className="mb-1 small">{user.first_name} {user.last_name}</h6>
                                <small className="text-muted">{user.role} • Joined {user.date_joined}</small>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="list-group-item border-0 text-muted p-2 text-center small">
                          No recent users
                        </div>
                      )
                    )}

                    {userData.role === 'client' && (
                      dashboardData.recent_jobs.length > 0 ? (
                        dashboardData.recent_jobs.map(job => (
                          <div key={job.id} className="list-group-item border-0 p-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1 small">{job.job_id}</h6>
                                <small className="text-muted">{job.status}</small>
                              </div>
                              <span className={`badge bg-${job.status === 'completed' ? 'success' : 'primary'}`}>
                                {job.deadline}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="list-group-item border-0 text-muted p-2 text-center small">
                          No recent jobs
                        </div>
                      )
                    )}

                    {userData.role === 'welder' && (
                      dashboardData.upcoming_tasks.length > 0 ? (
                        dashboardData.upcoming_tasks.map(task => (
                          <div key={task.id} className="list-group-item border-0 p-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1 small">{task.description}</h6>
                                <small className="text-muted">Due: {task.due_date}</small>
                              </div>
                              <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="list-group-item border-0 text-muted p-2 text-center small">
                          No upcoming tasks
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body">
                <h4>{currentConfig.tabs.find(tab => tab.id === activeTab)?.label}</h4>
                <div className="alert alert-info mt-3 mb-0">
                  {activeTab} content would be loaded here based on {userData.role} role.
                  <br />
                  <small className="text-muted">This is a placeholder for the {activeTab} tab functionality.</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="d-block d-lg-none fixed-bottom bg-white shadow-lg border-top">
        <div className="container px-0">
          <div className="row g-0">
            {currentConfig.tabs.slice(0, 4).map(tab => (
              <div className="col text-center" key={tab.id}>
                <button 
                  className={`btn btn-link w-100 p-2 ${activeTab === tab.id ? 'text-primary' : 'text-muted'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="d-block mx-auto fs-5" />
                  <small className="d-block mt-1 small">{tab.label.split(' ')[0]}</small>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;