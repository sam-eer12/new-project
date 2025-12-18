import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Work from '../components/Work';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex pt-16">
        <SideBar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="ml-64 flex-1">
          <Work activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
