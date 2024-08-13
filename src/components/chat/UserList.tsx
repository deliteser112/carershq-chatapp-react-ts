import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchUsers } from '../../features/chat/chatSlice';
import { UserListItem } from './UserListItem';

interface UserListProps {
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
  messages: Array<{
    messageId: number;
    chatId: number;
    sinkId: number;
    destinationId: number;
    body: string;
    createdDateTime: number;
  }>;
}

const UserList: React.FC<UserListProps> = ({ selectedUserId, onSelectUser, messages }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.chat.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const getLastMessage = (userId: number) => {
    const userMessages = messages.filter(msg => msg.chatId === userId);
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage ? lastMessage.body : '';
  };

  const getLastMessageTime = (userId: number) => {
    const userMessages = messages.filter(msg => msg.chatId === userId);
    const lastMessage = userMessages[userMessages.length - 1];
    return lastMessage ? new Date(lastMessage.createdDateTime * 1000).toLocaleTimeString() : '';
  };

  const filteredUsers = users.filter(user => user.userId !== 1); // Exclude Mr. Interviewee

  return (
    <div className="space-y-2">
      {filteredUsers.map((user) => (
        <UserListItem
          key={user.userId}
          user={user}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
          lastMessage={getLastMessage(user.userId - 1)}
          lastMessageTime={getLastMessageTime(user.userId - 1)}
        />
      ))}
    </div>
  );
};

export { UserList };
