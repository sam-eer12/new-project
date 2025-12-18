import React, { useState, useEffect } from 'react';
import { api } from '../context/AppContext';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    total_crops: 0,
    active_crops: 0,
    harvested_crops: 0,
    username: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Crops</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_crops}</p>
            </div>
            <div className="text-4xl">🌾</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Crops</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active_crops}</p>
            </div>
            <div className="text-4xl">🌱</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Harvested</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.harvested_crops}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center gap-3">
              <span className="text-2xl">➕</span>
              <span className="font-medium text-gray-900">Add New Crop</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              <span className="font-medium text-gray-900">Analyze Leaf</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <span className="font-medium text-gray-900">View Reports</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🌱</span>
              <div>
                <p className="font-medium text-gray-900">Welcome to AgriTracker!</p>
                <p className="text-sm text-gray-600">Start by adding your first crop</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-linear-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">🚀 Get Started with AI Disease Detection</h2>
        <p className="mb-4 opacity-90">
          Upload a photo of your crop leaf and get instant disease diagnosis with organic cure suggestions.
        </p>
        <button className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-semibold">
          Try Leaf Analyzer
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
