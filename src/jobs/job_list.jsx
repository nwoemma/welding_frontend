import { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  PlusIcon,
  ChevronRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import JobCreate from './job_creation';
import './job.css';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: <ClockIcon className="h-4 w-4" />,
  in_progress: <ArrowPathIcon className="h-4 w-4" />,
  completed: <CheckIcon className="h-4 w-4" />,
  cancelled: <ExclamationTriangleIcon className="h-4 w-4" />,
};

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/rest/v2/jobs/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (response.status === 401) {
          // Token is invalid - remove it and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobCreated = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowCreateForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="job-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="job-container">
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="job-container">
      <div className="job-header">
        <div>
          <h1 className="job-title">Job Management</h1>
          <p className="job-subtitle">
            A list of all jobs including their details and current status
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          <PlusIcon className="btn-icon" />
          New Job
        </button>
      </div>

      {showCreateForm && (
        <div className="job-form-container mb-6">
          <JobCreate onSuccess={handleJobCreated} />
        </div>
      )}

      <div className="job-table-container">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <ExclamationTriangleIcon className="empty-state-icon" />
            <h3 className="empty-state-title">No jobs found</h3>
            <p className="empty-state-description">
              Get started by creating a new job.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="btn-icon" />
              New Job
            </button>
          </div>
        ) : (
          <table className="job-table">
            <thead>
              <tr>
                <th scope="col">Job Details</th>
                <th scope="col">Client/Welder</th>
                <th scope="col">Timeline</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col" className="text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IdentificationIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{job.job_id || 'N/A'}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{job.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <UserIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{job.client?.full_name || '-'}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{job.welder?.full_name || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <CalendarIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {job.deadline ? formatDate(job.deadline) : 'No deadline'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${statusStyles[job.status]}`}>
                      {statusIcons[job.status]}
                      <span className="capitalize">{job.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {job.price ? `€${parseFloat(job.price).toFixed(2)}` : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center justify-end">
                      View <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}