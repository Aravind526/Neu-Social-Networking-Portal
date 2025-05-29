import React from 'react';
import moment from 'moment';
import { Message as MessageType, User } from '../../../types';

interface MessageProps {
  message: MessageType;
  currentUser: User | null;
}

const Message: React.FC<MessageProps> = ({ message, currentUser }) => {
  const isOwnMessage = currentUser?.uid === message.user.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && (
        <img
          src={message.user.avatar}
          alt={message.user.name}
          className="h-8 w-8 rounded-full mr-3"
        />
      )}
      
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center mb-1">
          {!isOwnMessage && (
            <span className="font-medium text-sm text-neutral-900 mr-2">
              {message.user.name}
            </span>
          )}
          <span className="text-xs text-neutral-500">
            {moment(message.timestamp).format('LT')}
          </span>
        </div>
        
        {message.content ? (
          <div className={`message-bubble ${
            isOwnMessage ? 'message-bubble-sent' : 'message-bubble-received'
          }`}>
            {message.content}
          </div>
        ) : message.image && (
          <img
            src={message.image}
            alt="Message attachment"
            className="max-w-sm rounded-lg shadow-md"
          />
        )}
      </div>
    </div>
  );
};

export default Message;