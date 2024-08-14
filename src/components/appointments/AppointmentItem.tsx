import React from "react";
import dayjs from "dayjs";

interface AppointmentItemProps {
  appointment: any;
  getUserName: (userId: number) => string;
  handleAccept: (appointmentId: number) => void;
  handleDelete: (appointmentId: number) => void;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({
  appointment,
  getUserName,
  handleAccept,
  handleDelete,
}) => {
  const formatDate = (timestamp: number) => {
    return dayjs.unix(timestamp).format("DD/MM/YYYY HH:mm");
  };

  const getEndTime = (timestamp: number) => {
    return dayjs.unix(timestamp).add(60, "minute").format("HH:mm");
  };

  const getStatus = (state: number) => {
    switch (state) {
      case 1:
        return (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Pending
          </span>
        );
      case 2:
        return (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Confirmed
          </span>
        );
      case 3:
        return (
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Deleted
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="block md:flex justify-between items-center">
        <div className="text-lg font-semibold">
          {formatDate(appointment.appointmentDateTime)} -{" "}
          {getEndTime(appointment.appointmentDateTime)}
        </div>
        <div className="text-xl">
          Interview with <span className="font-bold">{getUserName(appointment.acceptorUserId)}</span>
        </div>
      </div>
      <div className="text-gray-500 mt-1">
        Status: {getStatus(appointment.state)}
      </div>
      {appointment.state === 3 && appointment.deleteMessage && (
        <div className="text-gray-400 text-sm mt-2 italic">
          Deletion Reason: {appointment.deleteMessage}
        </div>
      )}
      {appointment.state === 1 && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => handleAccept(appointment.appointmentId)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Accept
          </button>
          <button
            onClick={() => handleDelete(appointment.appointmentId)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
