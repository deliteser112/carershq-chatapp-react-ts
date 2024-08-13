import React, { useState } from 'react';

const ScheduleAppointmentModal: React.FC<{ onClose: () => void; onSubmit: (date: string) => void }> = ({ onClose, onSubmit }) => {
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (date.trim() !== '') {
      onSubmit(date);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="font-bold text-lg mb-4">Schedule Appointment</h2>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export { ScheduleAppointmentModal };
