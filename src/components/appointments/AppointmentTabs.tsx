import React, { useState } from 'react';

const AppointmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex justify-between mb-4">
      {['Upcoming', 'Pending', 'Recurring', 'Past', 'Cancelled'].map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabChange(tab.toLowerCase())}
          className={`px-4 py-2 rounded-md ${
            activeTab === tab.toLowerCase()
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default AppointmentTabs;
