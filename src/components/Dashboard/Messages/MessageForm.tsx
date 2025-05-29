import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { Channel, User } from '../../../types';
import { Smile, Image as ImageIcon, Send } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageFormProps {
  currentChannel: Channel | null;
  currentUser: User | null;
  isPrivateChannel: boolean;
  getMessagesRef: () => string;
}

const MessageForm: React.FC<MessageFormProps> = ({
  currentChannel,
  currentUser,
  isPrivateChannel,
  getMessagesRef
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentChannel && currentUser) {
      setLoading(true);
      try {
        const messageData = {
          content: message,
          timestamp: serverTimestamp(),
          user: {
            id: currentUser.uid,
            name: currentUser.displayName || 'Anonymous',
            avatar: currentUser.photoURL || ''
          }
        };

        const channelId = isPrivateChannel
          ? [currentUser.uid, currentChannel.id].sort().join('_')
          : currentChannel.id;

        await addDoc(
          collection(db, getMessagesRef(), channelId, 'messages'),
          messageData
        );

        setMessage('');
        setErrors([]);
      } catch (error) {
        console.error(error);
        setErrors(['Error sending message. Please try again.']);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentChannel && currentUser) {
      setLoading(true);
      try {
        const filePath = `chat/public/${file.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const messageData = {
          image: downloadURL,
          timestamp: serverTimestamp(),
          user: {
            id: currentUser.uid,
            name: currentUser.displayName || 'Anonymous',
            avatar: currentUser.photoURL || ''
          }
        };

        const channelId = isPrivateChannel
          ? [currentUser.uid, currentChannel.id].sort().join('_')
          : currentChannel.id;

        await addDoc(
          collection(db, getMessagesRef(), channelId, 'messages'),
          messageData
        );

        setErrors([]);
      } catch (error) {
        console.error(error);
        setErrors(['Error uploading file. Please try again.']);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="bg-white border-t border-neutral-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={2}
          />
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-neutral-600 hover:text-primary transition-colors duration-200"
          >
            <Smile className="h-6 w-6" />
          </button>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-neutral-600 hover:text-primary transition-colors duration-200"
          >
            <ImageIcon className="h-6 w-6" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
          </button>
          
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className={`p-2 text-white bg-primary rounded-md hover:bg-primary-600 transition-colors duration-200 ${
              (loading || !message.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </form>
      
      {errors.length > 0 && (
        <div className="mt-2 text-error text-sm">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageForm;