import React from 'react';

interface UserListItemProps {
  user: {
    userId: number;
    name: string;
  };
  selectedUserId: number | null;
  onSelectUser: (userId: number) => void;
  lastMessage: string;
  lastMessageTime: string;
}

const UserListItem: React.FC<UserListItemProps> = React.memo(({ user, selectedUserId, onSelectUser, lastMessage, lastMessageTime }) => {
  return (
    <div
      key={user.userId}
      className={`flex items-center p-2 cursor-pointer rounded-lg ${selectedUserId === user.userId ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
      onClick={() => onSelectUser(user.userId)}
    >
      <img
        src={`https://avatars.dicebear.com/api/human/${user.userId}.svg`}
        alt={user.name}
        className="w-10 h-10 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500 truncate max-w-full">
          {lastMessage.length > 30 ? `${lastMessage.substring(0, 30)}...` : lastMessage}
        </div>
      </div>
      <span className="text-xs text-gray-400">{lastMessageTime}</span>
    </div>
  );
});

export { UserListItem };
