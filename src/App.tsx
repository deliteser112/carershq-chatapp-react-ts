import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Tabs } from './components/layout/Tabs';
import { ChatList } from './components/chat/ChatList';
import { SendMessageForm } from './components/chat/SendMessageForm';
import { AppointmentList } from './components/appointments/AppointmentList';
import { UserList } from './components/chat/UserList';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchHistoricalMessages, resetPagination, sendMessageAsync } from './features/chat/chatSlice';
import { ReactComponent as ChatIcon } from './assets/chat-icon.svg';

function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const users = useAppSelector((state) => state.chat.users);

  const selectedUser = users.find(user => user.userId === selectedUserId);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    dispatch(resetPagination()); // Reset pagination state
    dispatch(fetchHistoricalMessages({ userId, pageNumber: 1 })); // Load the first page
  };

  const handleSendMessage = (text: string) => {
    if (selectedUserId) {
      dispatch(sendMessageAsync({
        userId: selectedUserId,
        sinkId: 1,
        destinationId: selectedUserId,
        body: text,
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow p-0 md:p-4 flex bg-white shadow rounded-lg">
        {activeTab === 'chat' && (
          <div className="flex h-full w-full">
            <div className={`w-full flex-shrink-0 md:w-96 border-r p-4 bg-gray-50 ${selectedUserId ? 'hidden md:block' : 'block'}`}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <UserList selectedUserId={selectedUserId} onSelectUser={handleSelectUser} messages={messages} />
            </div>
            <div className={`flex-grow flex flex-col h-full p-0 sm:p-4 bg-white ${selectedUserId ? 'block' : 'hidden md:block'}`}>
              {selectedUserId ? (
                <>
                  <div className="flex items-center justify-between border-b px-4 pb-4 mb-4 ">
                    <button
                      className="md:hidden text-purple-500"
                      onClick={() => setSelectedUserId(null)}
                    >
                      ← Back
                    </button>
                    <h2 className="text-xl font-semibold">{selectedUser?.name}</h2>
                    <span className="text-green-500">Online</span>
                  </div>
                  <div className="flex-grow flex flex-col">
                    <ChatList selectedUserId={selectedUserId} />
                    <SendMessageForm onSendMessage={handleSendMessage} />
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-600 text-lg mt-[100px]">
                  <ChatIcon className="w-24 h-24 mb-4 text-gray-300" />
                  <p className="text-xl font-semibold text-gray-500 mb-2">No User Selected</p>
                  <p className="text-base text-gray-400">Select a user from the list to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'appointments' && <AppointmentList />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
