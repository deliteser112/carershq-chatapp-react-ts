import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchAppointments, createAppointmentAsync } from '../../features/appointments/appointmentSlice';
import { ScheduleAppointmentModal } from './ScheduleAppointmentModal';

const AppointmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector((state) => state.appointments.appointments);
  const status = useAppSelector((state) => state.appointments.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointments(1));  // Assuming 1 is the userId for Mr. Interviewee
  }, [dispatch]);

  const handleScheduleAppointment = (date: string) => {
    dispatch(createAppointmentAsync({
      chatId: 1,  // Example chatId
      initiatorUserId: 1,
      acceptorUserId: 2,  // Example acceptor userId
      appointmentDateTime: date,
    }));
    setIsModalOpen(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <button
        className="bg-blue-500 text-white p-2 rounded shadow"
        onClick={() => setIsModalOpen(true)}
      >
        Schedule Appointment
      </button>
      <div className="space-y-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`p-2 rounded shadow-sm ${appointment.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'}`}
          >
            {appointment.date} - {appointment.status}
          </div>
        ))}
      </div>
      {isModalOpen && <ScheduleAppointmentModal onClose={() => setIsModalOpen(false)} onSubmit={handleScheduleAppointment} />}
    </div>
  );
};

export { AppointmentList };
