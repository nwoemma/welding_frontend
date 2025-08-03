import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminAuth({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return localStorage.getItem('adminToken') ? children : null;
}

export default AdminAuth;