import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchAppointments,
  acceptAppointmentAsync,
  deleteAppointmentAsync,
} from "../../features/appointments/appointmentSlice";
import { fetchUsers } from "../../features/chat/chatSlice";

import '../../styles/appointments.css';

const AppointmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector(
    (state) => state.appointments.appointments
  );
  const users = useAppSelector((state) => state.chat.users);
  const status = useAppSelector((state) => state.appointments.status);
  const error = useAppSelector((state) => state.appointments.error);
  const [activeTab, setActiveTab] = useState("all"); // Manage tabs state

  useEffect(() => {
    dispatch(fetchAppointments(1)); // Assuming Mr. Interviewee's ID is 1
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAccept = (appointmentId: number) => {
    const confirmAccept = window.confirm(
      "Are you sure you want to accept this appointment?"
    );
    if (confirmAccept) {
      dispatch(acceptAppointmentAsync(appointmentId));
    }
  };

  const handleDelete = (appointmentId: number) => {
    const deleteMessage = prompt("Please enter a reason for deletion:", "");
    if (deleteMessage !== null) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this appointment?"
      );
      if (confirmDelete) {
        dispatch(deleteAppointmentAsync({ appointmentId, deleteMessage }));
      }
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  const formatDate = (timestamp: number) => {
    return dayjs.unix(timestamp).format("DD/MM/YYYY HH:mm");
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
      default:
        return (
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Deleted
          </span>
        );
    }
  };

  const getEndTime = (timestamp: number) => {
    return dayjs.unix(timestamp).add(60, "minute").format("HH:mm");
  };

  const groupAppointmentsByMonth = (appointments: any[]) => {
    return appointments.reduce((acc: any, appointment: any) => {
      const month = dayjs.unix(appointment.appointmentDateTime).format("MMMM");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(appointment);
      return acc;
    }, {});
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "pending") return appointment.state === 1;
    if (activeTab === "confirmed") return appointment.state === 2;
    if (activeTab === "deleted") return appointment.state === 3;
    // In the "all" tab, we exclude deleted appointments
    if (activeTab === "all") return appointment.state !== 3;
    return appointment;
  });

  const groupedAppointments = groupAppointmentsByMonth(filteredAppointments);

  if (status === "loading") {
    return <div>Loading appointments...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-4 w-full">
      <div className="flex justify-center mb-4">
        {["All", "Pending", "Confirmed", "Deleted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 rounded-md mr-2 ${
              activeTab === tab.toLowerCase()
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {Object.keys(groupedAppointments).length === 0 ? (
        <div className="text-center">No appointments found.</div>
      ) : (
        <div className="appointment-list-body overflow-y-auto bg-gray-200 p-4 rounded-lg">
          {Object.keys(groupedAppointments).map((month) => (
            <div key={month}>
              <div className="text-xl font-bold text-gray-800 mb-2">
                {month}
              </div>
              {groupedAppointments[month].map((appointment: any) => (
                <div
                  key={appointment.appointmentId}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                >
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
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { AppointmentList };
