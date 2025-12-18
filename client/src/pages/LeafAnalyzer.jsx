import React, { useState } from 'react';
import { api } from '../context/AppContext';

const LeafAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setAnalysis('');
      setError('');
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setAnalysis('');
    setError('');
  };

  const analyzeByUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post('/api/analyze-leaf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeByUrl = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/analyze-leaf-url', { url: imageUrl });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysis(response.data.analysis);
        setPreview(imageUrl);
      }
    } catch (err) {
      setError('Failed to analyze image. Please check the URL and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setImageUrl('');
    setPreview(null);
    setAnalysis('');
    setError('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Leaf Analyzer</h1>
      <p className="text-gray-600 mb-8">
        Upload a photo of your crop leaf or provide an image URL to get instant disease diagnosis and organic cure suggestions powered by Gemini AI.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'upload'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📤 Upload Image
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'url'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔗 Image URL
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-700 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected: {selectedFile.name}</p>
                </div>
              )}

              <button
                onClick={analyzeByUpload}
                disabled={!selectedFile || loading}
                className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Leaf'}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/leaf-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none mb-4"
              />

              <button
                onClick={analyzeByUrl}
                disabled={!imageUrl || loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Leaf'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {preview && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Leaf preview"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )}

          {(analysis || preview) && (
            <button
              onClick={reset}
              className="w-full mt-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Analyze Another Image
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Analyzing your leaf image...</p>
            </div>
          ) : analysis ? (
            <div className="prose max-w-none">
              <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
                <p className="text-sm font-semibold text-green-800 mb-1">✓ Analysis Complete</p>
                <p className="text-sm text-green-700">AI-powered diagnosis by Gemini 2.5 Flash</p>
              </div>
              
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysis}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is an AI-generated analysis. For serious crop issues, please consult with an agricultural expert.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🔬</div>
              <p className="text-gray-600 mb-2">No analysis yet</p>
              <p className="text-sm text-gray-500">
                Upload a leaf image to get started with AI-powered disease detection
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 Tips for Best Results</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Take clear, well-lit photos of the affected leaf area</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Focus on visible symptoms like spots, discoloration, or damage</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Include the entire leaf in the frame when possible</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Avoid blurry or low-resolution images</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeafAnalyzer;
