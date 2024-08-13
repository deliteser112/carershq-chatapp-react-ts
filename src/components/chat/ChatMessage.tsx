import React from 'react';

const ChatMessage: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="bg-white p-2 rounded shadow-sm">
      {text}
    </div>
  );
};

export { ChatMessage };
