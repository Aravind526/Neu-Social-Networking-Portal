import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { RootState } from '../../../redux/store';
import { Message as MessageType } from '../../../types';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { v4 as uuidv4 } from 'uuid';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { currentChannel, isPrivateChannel } = useSelector((state: RootState) => state.channel);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getMessagesRef = () => {
    return isPrivateChannel ? 'privateMessages' : 'messages';
  };

  const getChannelId = () => {
    if (isPrivateChannel) {
      return currentUser?.uid && currentChannel?.id 
        ? [currentUser.uid, currentChannel.id].sort().join('_') 
        : null;
    } else {
      return currentChannel?.id || null;
    }
  };

  useEffect(() => {
    if (currentChannel) {
      setLoading(true);
      setMessages([]);
      
      const channelId = getChannelId();
      if (!channelId) return;
      
      const messagesRef = collection(db, getMessagesRef(), channelId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedMessages: MessageType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMessages.push({
            id: doc.id,
            content: data.content,
            timestamp: data.timestamp?.toMillis() || Date.now(),
            user: data.user,
            image: data.image || undefined
          });
        });
        
        setMessages(fetchedMessages);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [currentChannel, isPrivateChannel, currentUser]);

  useEffect(() => {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'gi');
      const results = messages.filter(
        message => message.content && message.content.match(regex)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const displayMessages = (messages: MessageType[]) => {
    return messages.length > 0 && messages.map(message => (
      <Message
        key={message.id}
        message={message}
        currentUser={currentUser}
      />
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <MessageHeader 
        channelName={currentChannel?.name || ''}
        isPrivateChannel={isPrivateChannel}
        usersCount={0} // TODO: Implement users count
        handleSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        searchTerm={searchTerm}
      />
      
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <p className="text-lg mb-2">No messages yet</p>
            <p className="text-sm">Be the first to send a message in this channel!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayMessages(searchResults.length > 0 ? searchResults : messages)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <MessageForm
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
        getMessagesRef={getMessagesRef}
      />
    </div>
  );
};

export default Messages;