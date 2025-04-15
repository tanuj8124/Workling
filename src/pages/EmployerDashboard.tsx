import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User } from '../types';
import { Star, Plus, Users, BriefcaseIcon } from 'lucide-react';

interface JobApplicant {
  workerId: string;
  name: string;
  email: string;
  rating: number;
  skills: string[];
  certificates: string[];
  appliedAt: string;
}

interface JobWithApplicants {
  jobId: string;
  title: string;
  description: string;
  applicants: JobApplicant[];
}

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'workers' | 'applicants'>('workers');
  const [workers, setWorkers] = useState<User[]>([]);
  const [jobApplicants, setJobApplicants] = useState<JobWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view this page');
          return;
        }

        if (activeTab === 'workers') {
          const response = await axios.get('https://workling1829293.df.r.appspot.com/api/workers');
          setWorkers(response.data);
        } else {
          const response = await axios.get('https://workling1829293.df.r.appspot.com/api/my-posted-jobs', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setJobApplicants(response.data.jobs);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.msg || `Failed to fetch ${activeTab}`;
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleRequest = (workerEmail: string) => {
    if (!workerEmail) {
      toast.error('Worker email not available');
      return;
    }
  
    const subject = encodeURIComponent('Work Request');
    const body = encodeURIComponent('Hello,\n\nI would like to request your assistance. Please let me know your availability.\n\nBest regards,');
    const mailtoLink = `mailto:${workerEmail}?subject=${subject}&body=${body}`;
  
    window.location.href = mailtoLink;
  };
  
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to create jobs');
        return;
      }

      await axios.post('https://workling1829293.df.r.appspot.com/api/publish-job', jobForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job posted successfully!');
      setShowJobModal(false);
      setJobForm({ title: '', description: '' });
      
      // Refresh the job applicants list if we're on that tab
      if (activeTab === 'applicants') {
        const response = await axios.get('https://workling1829293.df.r.appspot.com/api/my-job-applicants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobApplicants(response.data.jobs);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || 'Failed to create job';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('workers')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'workers'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Available Workers
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center px-4 py-2 rounded-md ${
              activeTab === 'applicants'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            Job Applicants
          </button>
        </div>
        <button
          onClick={() => setShowJobModal(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Job
        </button>
      </div>

      {activeTab === 'workers' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <motion.div
              key={worker._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{worker.name}</h2>
                  <p className="text-gray-600">{worker.email}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{worker.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {worker.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Certificates</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {worker.certificates?.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-lg font-semibold text-gray-900">
                  Rs.{worker.price}/hr
                </div>
                <button
                  onClick={() => handleRequest(worker.email)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                 Get Contact
                </button>
              </div>
            </motion.div>
          ))}

          {workers.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No workers available at the moment
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {jobApplicants.map((job) => (
            <motion.div
              key={job.jobId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">{job.title}</h2>
              <p className="text-gray-600 mb-6">{job.description}</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Applicants ({job.applicants.length})
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {job.applicants.map((applicant) => (
                  <div
                    key={applicant.workerId}
                    className="border rounded-lg p-4 hover:border-indigo-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                        <p className="text-gray-600 text-sm">{applicant.email}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm">{applicant.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {applicant.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {applicant.certificates?.map((cert, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          {jobApplicants.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applications received yet
            </div>
          )}
        </div>
      )}

      {/* Job Creation Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-4">Create New Job</h2>
            <form onSubmit={handleCreateJob}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Create Job
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;