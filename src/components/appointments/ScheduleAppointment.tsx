import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createAppointmentAsync } from '../../features/appointments/appointmentSlice';

interface ScheduleAppointmentProps {
  selectedUserId: number;
  closeModal: () => void;
}

const ScheduleAppointment: React.FC<ScheduleAppointmentProps> = ({ selectedUserId, closeModal }) => {
  const [datetime, setDatetime] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleSchedule = () => {
    if (selectedUserId) {
      dispatch(createAppointmentAsync({
        initiatorUserId: 1,
        acceptorUserId: selectedUserId,
        appointmentDateTime: new Date(datetime).toISOString(), // Convert to ISO string for consistency
      }));
      closeModal();
    }
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700">Select Date and Time</label>
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="mt-1 p-2 border rounded-lg w-full"
      />
      <div className="flex justify-end mt-4 space-x-2">
        <button onClick={closeModal} className="px-4 py-2 text-gray-500 border rounded-lg">Cancel</button>
        <button onClick={handleSchedule} className="px-4 py-2 text-white bg-blue-500 rounded-lg">OK</button>
      </div>
    </div>
  );
};

export { ScheduleAppointment };
