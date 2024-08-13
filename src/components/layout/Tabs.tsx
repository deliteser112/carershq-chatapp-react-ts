import React from 'react';

const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-gray-100 p-2 flex justify-center space-x-4">
      <button
        className={`font-semibold px-4 py-2 ${activeTab === 'chat' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
        onClick={() => setActiveTab('chat')}
      >
        Chat
      </button>
      <button
        className={`font-semibold px-4 py-2 ${activeTab === 'appointments' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
        onClick={() => setActiveTab('appointments')}
      >
        Appointments
      </button>
    </div>
  );
};

export { Tabs };
