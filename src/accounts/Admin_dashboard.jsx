import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { 
  FaUsers, FaUserCog, FaUserShield, FaUserPlus, 
  FaChartBar, FaClipboardList, FaFileInvoiceDollar, 
  FaCog, FaBell, FaSignOutAlt, FaTachometerAlt,
  FaEye, FaEdit, FaTrash, FaCheck, FaTimes
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  Dropdown, 
  Table, 
  Button, 
  Badge, 
  Alert,
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = 'https://welding-backend-vm1n.onrender.com/api/rest/v2/dashboard/';

// Styled components - EXACTLY AS YOU HAD THEM
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  overflow: hidden;
  
  .main-content {
    flex: 1;
    padding: 0;
    margin-left: 250px;
    transition: margin 0.3s;
  }
  
  .content-area {
    padding: 20px;
    margin-top: 56px;
    min-height: calc(100vh - 56px);
  }
  
  .tab-content {
    background: transparent;
    border: none;
    
    .card {
      border: none;
      border-radius: 0.5rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
      margin-bottom: 20px;
      
      &-body {
        padding: 1.25rem;
      }
    }
  }
  
  .navbar {
    position: fixed;
    width: 100%;
    height: 56px;
    z-index: 1000;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .d-flex {
    display: flex;
    width: 15%;
  }
  .sidebar {
    position: fixed;
    width: 250px;
    height: 100vh;
    background: white;
    border-right: 1px solid rgba(0,0,0,0.1);
    z-index: 999;
    padding-top: 56px;
    overflow-y: auto;
  }
  
  .nav-pills .nav-link {
    border-radius: 0.25rem;
    margin-bottom: 0.25rem;
    
    &.active {
      background-color: #0d6efd;
    }
  }
`;

function AdminDashboard() {
  // State management - EXACTLY AS YOU HAD IT
  const [adminData, setAdminData] = useState({
    name: 'Admin',
    email: '',
    last_login: ''
  });
  
  const [dashboardData, setDashboardData] = useState({
    stats: [
      { label: 'Total Users', value: 0, trend: 'up', change: '5%' },
      { label: 'Active Jobs', value: 0, trend: 'down', change: '2%' },
      { label: 'Pending Approvals', value: 0 },
      { label: 'System Health', value: '100%' }
    ],
    notifications: [],
    recent_users: [],
    pending_approvals: [],
    activity_chart: null,
    user_distribution: null,
    unread_notifications: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Data fetching - EXACTLY AS YOU HAD IT
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          navigate('/admin/signin');
          return;
        }

        const response = await axios.get(API_BASE_URL, {
          headers: { 
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
        });

        setAdminData({
          name: response.data.admin?.name || 'Admin',
          email: response.data.admin?.email || '',
          last_login: response.data.admin?.last_login || ''
        });
        
        setDashboardData(prev => ({
          ...prev,
          stats: response.data.stats || prev.stats,
          notifications: response.data.notifications || [],
          recent_users: response.data.recent_users || [],
          pending_approvals: response.data.pending_approvals || [],
          activity_chart: response.data.activity_chart || null,
          user_distribution: response.data.user_distribution || null,
          unread_notifications: response.data.unread_notifications || 0
        }));

      } catch (err) {
        console.error('Admin dashboard error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/signin');
        } else {
          setError(err.message || 'Failed to load admin dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Tab configuration - EXACTLY AS YOU HAD IT
  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'approvals', label: 'Approvals', icon: FaUserPlus },
    { id: 'reports', label: 'Reports', icon: FaFileInvoiceDollar }
  ];

  const adminQuickActions = [
    { label: 'Add User', icon: FaUserPlus, path: '/admin/users/add' },
    { label: 'Manage Roles', icon: FaUserCog, path: '/admin/roles' },
    { label: 'View Audit Logs', icon: FaClipboardList, path: '/admin/audit-logs' }
  ];

  // Chart rendering - EXACTLY AS YOU HAD IT
  const renderChart = (chartData) => {
    if (!chartData) return (
      <div className="text-center py-5 text-muted">
        <small>Chart data loading...</small>
      </div>
    );
    const chartProps = {
    data: chartData.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...chartData.options
    }
  };
    switch (chartData.type) {
      case 'bar':
        return <Bar data={chartProps.data} options={chartProps.options} height={300} />;
      case 'pie':
        return <Pie data={chartProps.data} options={chartProps.options} height={300} />;
      default:
        return <div className="text-muted p-4">Unsupported chart type</div>;
    }
  };

  // Action handlers - EXACTLY AS YOU HAD THEM
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/signin');
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
  };

  const handleApprovalAction = (action, approvalId) => {
    console.log(`${action} approval ${approvalId}`);
  };

  // Loading state - EXACTLY AS YOU HAD IT
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Admin Dashboard...</p>
        </div>
      </Container>
    );
  }

  // Error state - EXACTLY AS YOU HAD IT
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Admin Dashboard Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Main render - EXACTLY AS YOU HAD IT
  return (
    <DashboardContainer>
      {/* Top Navigation - EXACTLY AS YOU HAD IT */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Container fluid>
          <Link className="navbar-brand" to="/admin/dashboard">
            <FaUserShield className="me-2" />
            <strong>Admin Console</strong>
          </Link>
          
          <div className="d-flex align-items-center">
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="light" className="position-relative">
                <FaBell />
                {dashboardData.unread_notifications > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {dashboardData.unread_notifications}
                  </Badge>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>Notifications</Dropdown.Header>
                {dashboardData.notifications.length > 0 ? (
                  dashboardData.notifications.map(notification => (
                    <Dropdown.Item key={notification.id}>
                      <div className="d-flex justify-content-between">
                        <span>{notification.message}</span>
                        <small className="text-muted ms-3">{notification.time}</small>
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No new notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
                <Dropdown.Toggle 
                    variant="link" 
                    className="p-1 bg-transparent border-0 text-decoration-none shadow-none"
                >
                    <div className="d-flex align-items-center">
                    <span className="small me-1">{adminData.name}</span>
                    <div className="bg-dark rounded-circle p-1">
                        <FaUserShield className="text-white" style={{ fontSize: '0.9rem' }} />
                    </div>
                    </div>
                </Dropdown.Toggle>
                
                <Dropdown.Menu align="end" className="mt-1 py-0">
                    <Dropdown.Item as={Link} to="/admin/profile" className="py-2 small">
                    <FaUserCog className="me-2" /> Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/admin/settings" className="py-2 small">
                    <FaCog className="me-2" /> Settings
                    </Dropdown.Item>
                    <Dropdown.Divider className="my-0" />
                    <Dropdown.Item onClick={handleLogout} className="py-2 small">
                    <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </nav>

      {/* Sidebar - EXACTLY AS YOU HAD IT */}
      <div className="sidebar">
        <div className="p-3">
          <ul className="nav nav-pills flex-column">
            {adminTabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link text-start w-100 d-flex align-items-center ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="me-2" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          
          <hr />
          
          <div className="mb-3">
            <h6 className="text-muted small px-3">QUICK ACTIONS</h6>
            {adminQuickActions.map(action => (
              <Link
                key={action.label}
                to={action.path}
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-start mb-2 px-3"
              >
                <action.icon className="me-2" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - EXACTLY AS YOU HAD IT */}
      <main className="main-content">
        <div className="content-area">
          {/* Overview Tab - EXACTLY AS YOU HAD IT */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <Card>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <h4 className="mb-1">Welcome back, {adminData.name}!</h4>
                      <p className="text-muted mb-0">
                        You have full system administration privileges.
                      </p>
                    </Col>
                    <Col xs="auto">
                      <Badge bg="primary" className="p-2">
                        Last login: {adminData.last_login || 'Today'}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Row className="mb-4 g-4">
                {dashboardData.stats.map((stat, index) => (
                  <Col key={index} md={6} lg={3}>
                    <Card className="h-100">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col>
                            <h6 className="text-muted text-uppercase small">{stat.label}</h6>
                            <h2 className="mb-0 fw-bold">{stat.value}</h2>
                            {stat.trend && (
                              <small className={`text-${stat.trend === 'up' ? 'success' : 'danger'}`}>
                                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                              </small>
                            )}
                          </Col>
                          <Col xs="auto">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                              <FaChartBar className="text-primary" />
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="mb-4 g-4">
                <Col lg={8}>
                  <Card className="h-100">
                    <Card.Header className="bg-white">
                      <h5>System Activity</h5>
                    </Card.Header>
                    <Card.Body>
                      {renderChart(dashboardData.activity_chart)}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="h-100">
                    <Card.Header className="bg-white">
                      <h5>User Distribution</h5>
                    </Card.Header>
                    <Card.Body>
                      {renderChart(dashboardData.user_distribution)}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="g-4">
                <Col lg={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Recent Users</h5>
                      <Button variant="outline-primary" size="sm" as={Link} to="/admin/users">
                        View All
                      </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Table striped hover className="mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recent_users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td>
                                <Button 
                                  variant="info" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleUserAction('view', user.id)}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="warning" 
                                  size="sm"
                                  onClick={() => handleUserAction('edit', user.id)}
                                >
                                  <FaEdit />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Pending Approvals</h5>
                      <Button variant="outline-primary" size="sm" as={Link} to="/admin/approvals">
                        View All
                      </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Table striped hover className="mb-0">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Request</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.pending_approvals.map(approval => (
                            <tr key={approval.id}>
                              <td>{approval.user_name}</td>
                              <td>{approval.request_type}</td>
                              <td>{approval.created_at}</td>
                              <td>
                                <Button 
                                  variant="success" 
                                  size="sm" 
                                  className="me-1"
                                  onClick={() => handleApprovalAction('approve', approval.id)}
                                >
                                  <FaCheck />
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => handleApprovalAction('reject', approval.id)}
                                >
                                  <FaTimes />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* Other tabs - EXACTLY AS YOU HAD THEM */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <Card>
                <Card.Body>
                  <h4>User Management</h4>
                  <Alert variant="info" className="mt-3">
                    Complete user management interface would be displayed here.
                    <br />
                    <small className="text-muted">Including user creation, editing, and role assignment.</small>
                  </Alert>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="tab-content">
              <Card>
                <Card.Body>
                  <h4>Approval Queue</h4>
                  <Alert variant="info" className="mt-3">
                    Full approval management system would be implemented here.
                    <br />
                    <small className="text-muted">For handling user requests, permissions, and other approvals.</small>
                  </Alert>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="tab-content">
              <Card>
                <Card.Body>
                  <h4>System Reports</h4>
                  <Alert variant="info" className="mt-3">
                    Comprehensive reporting tools would be available here.
                    <br />
                    <small className="text-muted">Including usage statistics, activity logs, and performance metrics.</small>
                  </Alert>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </main>
    </DashboardContainer>
  );
}

export default AdminDashboard;