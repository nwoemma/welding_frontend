import React, { useState, useEffect } from 'react';

const WeldingWorkLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/welding-work-logs');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching welding logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Calculate total hours
  const totalHours = logs.reduce((total, log) => total + log.hours, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block relative w-12 h-12">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping"></div>
            <div className="absolute inset-1 bg-orange-500 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading welding logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-800">Error Loading Data</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-xl max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <svg className="w-8 h-8 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
            Welding Work Logs
          </h2>
          <p className="text-gray-600 mt-1">Track and manage welding project progress</p>
        </div>
        
        {logs.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-3 rounded-xl shadow">
            <span className="font-semibold text-xl">{totalHours.toFixed(1)}</span> total hours
          </div>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No welding logs yet</h3>
          <p className="text-gray-500">Get started by adding your first welding work entry</p>
          <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
            Add New Log
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
                  {new Date(log.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="text-sm bg-gradient-to-r from-amber-100 to-orange-50 text-amber-700 font-semibold px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                  {log.hours} hrs
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                {log.project} - {log.task}
              </h3>
              
              <p className="text-gray-600 pl-4 border-l-2 border-amber-200 ml-1 mb-4">{log.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  {log.materials}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {log.welder}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeldingWorkLogs;