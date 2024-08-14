import React, { useState, useEffect } from "react";

interface User {
  userId: number;
  name: string;
}

interface ScheduleAppointmentModalProps {
  users: User[];
  selectedUserId: number | null;
  onClose: () => void;
  onSchedule: (appointmentData: {
    dateTime: string;
    selectedUserId: number;
  }) => void;
}

export const ScheduleAppointmentModal: React.FC<
  ScheduleAppointmentModalProps
> = ({ users, selectedUserId, onClose, onSchedule }) => {
  const [userId, setUserId] = useState<number | null>(selectedUserId);
  const [dateTime, setDateTime] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (selectedUserId) {
      setUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSchedule = () => {
    console.log("handleSchedule", userId, dateTime);
    if (userId && dateTime) {
      console.log("handleSchedule");
      onSchedule({ dateTime, selectedUserId: userId });
      setShowConfirmation(true); // Show confirmation modal after scheduling
    }
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full md:w-[450px]">
        {showConfirmation ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Confirm</h2>
            <p className="mb-4">
              Proposed interview with{" "}
              {users.find((u) => u.userId === userId)?.name} on{" "}
              {new Date(dateTime).toLocaleDateString()} at{" "}
              {new Date(dateTime).toLocaleTimeString()}.
            </p>
            <button
              className="bg-purple-500 text-white p-2 rounded-lg w-full"
              onClick={closeModal}
            >
              OK
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">Schedule Appointment</h2>
            <div className="mb-4">
              <label className="block mb-2">User</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={userId || ""}
                onChange={(e) => setUserId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Select User
                </option>
                {users
                  .filter((user) => user.userId !== 1)
                  .map(
                    (
                      user // Exclude Mr. Interviewee
                    ) => (
                      <option key={user.userId} value={user.userId}>
                        {user.name}
                      </option>
                    )
                  )}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Interview Date</label>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded-lg"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 p-2 rounded-lg px-8"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white p-2 rounded-lg px-8"
                onClick={handleSchedule}
                disabled={!userId || !dateTime}
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
