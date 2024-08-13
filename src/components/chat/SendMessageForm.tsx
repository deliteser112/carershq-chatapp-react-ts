import React, { useState } from 'react';

const SendMessageForm: React.FC<{ onSendMessage: (text: string) => void }> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-2 border rounded-lg focus:outline-none"
      />
      <div className="flex space-x-2">
        <button type="button" className="text-gray-500">
          📎
        </button>
        <button type="button" className="text-gray-500">
          😀
        </button>
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow">
          Send
        </button>
      </div>
    </form>
  );
};

export { SendMessageForm };
