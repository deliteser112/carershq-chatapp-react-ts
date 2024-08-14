import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchAppointments, acceptAppointmentAsync, deleteAppointmentAsync } from '../../features/appointments/appointmentSlice';
import { Appointment } from '../../types'; // Adjust the path as needed

const AppointmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const appointments: any[] = useAppSelector((state) => state.appointments.appointments);
  const status = useAppSelector((state) => state.appointments.status);
  const error = useAppSelector((state) => state.appointments.error);

  // Fetch appointments on component mount
  useEffect(() => {
    dispatch(fetchAppointments(1)); // Assuming 1 is the userId for Mr. Interviewee
  }, [dispatch]);

  const handleAccept = (appointmentId: number) => {
    dispatch(acceptAppointmentAsync(appointmentId));
  };

  const handleDelete = (appointmentId: number) => {
    const deleteMessage = prompt("Please enter a reason for deletion:", "");
    if (deleteMessage !== null) {
      dispatch(deleteAppointmentAsync({ appointmentId, deleteMessage }))
        .then((response) => {
          if (response.payload.message === 'Appointment deleted successfully') {
            alert('Appointment deleted successfully');
          }
        });
    }
  };

  if (status === 'loading') {
    return <div>Loading appointments...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {appointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.appointmentId} className="p-4 mb-4 border rounded-lg shadow">
            <div className="text-lg font-semibold">
              Interview with User ID: {appointment.acceptorUserId}
            </div>
            <div className="text-gray-500">
              {new Date(appointment.appointmentDateTime * 1000).toLocaleString()}
            </div>
            <div className="text-gray-500">
              Status: {appointment.state === 1 ? 'Pending' : 'Confirmed'}
            </div>
            {appointment.state === 1 && (
              <div className="mt-2">
                <button
                  onClick={() => handleAccept(appointment.appointmentId)}
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDelete(appointment.appointmentId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export { AppointmentList };
