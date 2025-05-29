import React from 'react';
import { Search } from 'lucide-react';

interface MessageHeaderProps {
  channelName: string;
  isPrivateChannel: boolean;
  usersCount: number;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  channelName,
  isPrivateChannel,
  usersCount,
  handleSearchChange,
  searchTerm
}) => {
  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            {isPrivateChannel ? '@' : '#'}{channelName}
            {!isPrivateChannel && (
              <span className="ml-2 text-sm font-normal text-neutral-500">
                {usersCount} {usersCount === 1 ? 'member' : 'members'}
              </span>
            )}
          </h2>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search Messages"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;