import React from 'react';

const SideBar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'crops', label: 'My Crops', icon: '🌾' },
    { id: 'analyzer', label: 'Leaf Analyzer', icon: '🔬' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-16">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeSection === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
