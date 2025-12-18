import React from 'react';
import DashboardHome from '../pages/DashboardHome';
import MyCrops from '../pages/MyCrops';
import LeafAnalyzer from '../pages/LeafAnalyzer';
import Profile from '../pages/Profile';

const Work = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardHome />;
      case 'crops':
        return <MyCrops />;
      case 'analyzer':
        return <LeafAnalyzer />;
      case 'profile':
        return <Profile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex-1 p-8">
      {renderContent()}
    </div>
  );
};

export default Work;
