import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchAppointments,
  acceptAppointmentAsync,
  deleteAppointmentAsync,
} from "../../features/appointments/appointmentSlice";
import { fetchUsers } from "../../features/chat/chatSlice";

import { AppointmentItem } from "./AppointmentItem";
import Modal from "../common/Modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(message: string | undefined) => void>(() => {});

  const [isPrompt, setIsPrompt] = useState(false);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    dispatch(fetchAppointments(1)); // Assuming Mr. Interviewee's ID is 1
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAccept = (appointmentId: number) => {
    setModalTitle("Confirm Acceptance");
    setModalContent("Are you sure you want to accept this appointment?");
    setOnConfirmCallback(() => () => {
      dispatch(acceptAppointmentAsync(appointmentId));
      setIsModalOpen(false);
    });
    setIsModalOpen(true);
  };

  const handleDelete = (appointmentId: number) => {
    setIsPrompt(true);
    setModalTitle("Confirm Deletion");
    setModalContent("Are you sure you want to delete this appointment?");
    setOnConfirmCallback(() => (message: string) => {
      dispatch(deleteAppointmentAsync({ appointmentId, deleteMessage: message }));
      setIsModalOpen(false);
      setIsPrompt(false);
      setPromptInput("");
    });
    setIsModalOpen(true);
  };

  const handleDialogClose = () => {
    setIsPrompt(false);
    setIsModalOpen(false);
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  const groupAppointmentsByMonth = (appointments: any[]) => {
    // Sort appointments by date
    const sortedAppointments = appointments.sort((a, b) => b.appointmentDateTime - a.appointmentDateTime);
    
    return sortedAppointments.reduce((acc: any, appointment: any) => {
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
                <AppointmentItem
                  key={appointment.appointmentId}
                  appointment={appointment}
                  getUserName={getUserName}
                  handleAccept={handleAccept}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          content={modalContent}
          onConfirm={(message: string) => onConfirmCallback(message)}
          onCancel={handleDialogClose}
          showInput={isPrompt}
          inputValue={promptInput}
          setInputValue={setPromptInput}
        />
      )}
    </div>
  );
};

export { AppointmentList };
