import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Briefcase, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Perfect Freelancer for Your Project
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with skilled professionals or find your next opportunity
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center"
            >
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Find Talent</h3>
            <p className="text-gray-600">
              Access a global pool of skilled professionals ready to work on your projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <Briefcase className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
            <p className="text-gray-600">
              Create detailed job listings and connect with the perfect candidates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <Star className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Work</h3>
            <p className="text-gray-600">
              Get high-quality results from verified professionals with proven track records.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;