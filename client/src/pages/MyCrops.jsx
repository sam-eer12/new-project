import React, { useState, useEffect } from 'react';
import { api } from '../context/AppContext';

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    crop_name: '',
    crop_type: '',
    planting_date: '',
    expected_harvest: '',
    area: '',
    status: 'Active',
    notes: ''
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get('/api/crops');
      setCrops(response.data.crops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await api.put(`/api/crops/${editingCrop._id}`, formData);
      } else {
        await api.post('/api/crops', formData);
      }
      fetchCrops();
      resetForm();
    } catch (error) {
      console.error('Error saving crop:', error);
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      crop_name: crop.crop_name,
      crop_type: crop.crop_type,
      planting_date: crop.planting_date,
      expected_harvest: crop.expected_harvest,
      area: crop.area,
      status: crop.status,
      notes: crop.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await api.delete(`/api/crops/${cropId}`);
        fetchCrops();
      } catch (error) {
        console.error('Error deleting crop:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      crop_name: '',
      crop_type: '',
      planting_date: '',
      expected_harvest: '',
      area: '',
      status: 'Active',
      notes: ''
    });
    setEditingCrop(null);
    setShowModal(false);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Crops</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
        >
          <span className="text-xl">➕</span>
          Add New Crop
        </button>
      </div>

      {crops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No crops yet</h2>
          <p className="text-gray-600 mb-6">Start tracking your crops by adding your first one!</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Add Your First Crop
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div key={crop._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{crop.crop_name}</h3>
                  <p className="text-gray-600">{crop.crop_type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  crop.status === 'Active' ? 'bg-green-100 text-green-700' :
                  crop.status === 'Harvested' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {crop.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📅</span>
                  <span>Planted: {crop.planting_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🎯</span>
                  <span>Harvest: {crop.expected_harvest}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📏</span>
                  <span>Area: {crop.area}</span>
                </div>
              </div>

              {crop.notes && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{crop.notes}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(crop)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(crop._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    name="crop_name"
                    value={formData.crop_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="e.g., Wheat Field A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type *
                  </label>
                  <input
                    type="text"
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="e.g., Wheat, Rice, Corn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planting Date *
                  </label>
                  <input
                    type="date"
                    name="planting_date"
                    value={formData.planting_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Harvest *
                  </label>
                  <input
                    type="date"
                    name="expected_harvest"
                    value={formData.expected_harvest}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="e.g., 5 acres, 2 hectares"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Harvested">Harvested</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="Additional notes about this crop..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {editingCrop ? 'Update Crop' : 'Add Crop'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCrops;
