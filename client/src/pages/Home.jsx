import React from 'react';
import { Link } from 'react-router-dom';
import Snowfall from 'react-snowfall';
const Home = () => {
  return (
    <>
    <Snowfall color='#5C9CB0' />
    <div className="min-h-screen bg-gradient-to-bottom from-green-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span onClick={navigate('/')} className="text-2xl font-bold text-green-600">🌾 AgriTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-green-600 hover:text-green-700 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Farming Made <span className="text-green-600">Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your crops, detect diseases instantly with AI, and manage your farming data all in one place.
            Join thousands of farmers revolutionizing agriculture.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Crop Tracking</h3>
            <p className="text-gray-600">
              Monitor your crops from planting to harvest. Track growth stages, manage schedules, and optimize yields.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Disease Detection</h3>
            <p className="text-gray-600">
              Upload leaf images and get instant disease diagnosis with organic cure suggestions powered by Gemini AI.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Get insights into your farming operations with comprehensive dashboards and data visualization.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-green-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join AgriTracker today and experience the future of farming.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 AgriTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Home;
