import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Job } from '../types';
import { Calendar, Clock } from 'lucide-react';

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://workling1829293.df.r.appspot.com/api/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(response.data);
      } catch (error) {
        toast.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to apply for jobs');
        return;
      }

      await axios.post(`https://workling1829293.df.r.appspot.com/api/apply-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the local state to reflect the application
      setJobs(jobs.map(job => 
        job._id === jobId 
          ? { ...job, hasApplied: true }
          : job
      ));
      
      toast.success('Applied successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || 'Failed to apply for the job';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Jobs</h1>
      
      <div className="grid gap-6">
        {jobs.map((job) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">{job.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Posted by {job.createdBy.name}</span>
              </div>
              
              <button
                onClick={() => handleApply(job._id)}
                disabled={job.hasApplied}
                className={`px-4 py-2 rounded ${
                  job.hasApplied
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {job.hasApplied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </motion.div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No jobs available at the moment
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;