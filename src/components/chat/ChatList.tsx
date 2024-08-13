import React, { useEffect, useRef } from 'react';

interface ChatMessage {
  messageId: number;
  chatId: number;
  sinkId: number;
  destinationId: number;
  body: string;
  createdDateTime: number;
}

interface ChatListProps {
  messages: ChatMessage[];
}

const ChatList: React.FC<ChatListProps> = ({ messages }) => {
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatListRef} className="flex-grow p-4 space-y-4 bg-gray-50 overflow-y-auto rounded-lg h-[300px] flex flex-col-reverse">
      {messages.map((message) => (
        <div
          key={message.messageId}
          className={`flex mt-4 w-full max-w-[1200px] mx-auto ${message.sinkId === 1 ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-center space-x-4 ${message.sinkId === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
            <img
              src={`https://avatars.dicebear.com/api/human/${message.sinkId}.svg`}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className={`p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-2xl ${message.sinkId === 1 ? 'bg-purple-500 text-white' : 'bg-white text-gray-900 shadow'}`}>
              <div className="text-sm break-words">{message.body}</div>
              <div className="text-xs text-gray-300">{new Date(message.createdDateTime * 1000).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { ChatList };
