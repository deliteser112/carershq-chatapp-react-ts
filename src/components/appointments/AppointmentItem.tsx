import React from 'react';

interface AppointmentItemProps {
  appointment: any;  // Define the correct type here
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{appointment.userName}</h3>
        <p className="text-gray-500">{new Date(appointment.datetime).toLocaleString()}</p>
      </div>
      <div className="text-sm text-gray-500">
        {appointment.status === 'initiated' ? 'Pending' : 'Confirmed'}
      </div>
    </div>
  );
};

export { AppointmentItem };
