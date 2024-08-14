import React, { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchHistoricalMessages } from '../../features/chat/chatSlice';

interface ChatListProps {
  selectedUserId: number | null;
}

const ChatList: React.FC<ChatListProps> = ({ selectedUserId }) => {
  const chatListRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages);
  const pageNumber = useAppSelector(state => state.chat.pageNumber);
  const hasMoreMessages = useAppSelector(state => state.chat.hasMoreMessages);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = useCallback(() => {
    if (chatListRef.current) {
      const { scrollTop } = chatListRef.current;
      if (scrollTop === 0 && hasMoreMessages && selectedUserId !== null) {
        // Load more messages when scrolled to the top
        dispatch(fetchHistoricalMessages({ userId: selectedUserId, pageNumber: pageNumber + 1 }));
      }
    }
  }, [dispatch, pageNumber, hasMoreMessages, selectedUserId]);

  useEffect(() => {
    const chatListNode = chatListRef.current;
    if (chatListNode) {
      chatListNode.addEventListener('scroll', handleScroll);
      return () => chatListNode.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div ref={chatListRef} className="flex-grow p-4 space-y-4 bg-gray-50 overflow-y-auto rounded-lg h-[300px] flex flex-col-reverse">
      {messages.map((message) => (
        <div
          key={`${message.messageId}-${message.createdDateTime}`}
          className={`flex mt-4 ${message.sinkId === 1 ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-center space-x-4 ${message.sinkId === 1 ? 'flex-row-reverse' : 'flex-row'}`}>
            <img
              src={`https://avatars.dicebear.com/api/human/${message.sinkId}.svg`}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className={`p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg ${message.sinkId === 1 ? 'bg-purple-500 text-white' : 'bg-white text-gray-900 shadow'}`}>
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
