import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../../redux/actions/channelActions';
import { User } from '../../../types';
import { MessageSquare } from 'lucide-react';

interface DirectMessagesProps {
  currentUser: User | null;
}

const DirectMessages: React.FC<DirectMessagesProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeChannel, setActiveChannel] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('id', '!=', currentUser.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const usersList: User[] = [];
        snapshot.forEach((doc) => {
          const userData = doc.data() as User;
          usersList.push(userData);
        });
        setUsers(usersList);
      });
      
      return () => unsubscribe();
    }
  }, [currentUser]);

  const changeChannel = (user: User) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.displayName || 'Anonymous'
    };
    
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    setActiveChannel(user.uid);
    navigate(`/direct/${channelId}`);
  };

  const getChannelId = (userId: string) => {
    const currentUserId = currentUser?.uid;
    return userId < currentUserId!
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <div className="mb-6">
      <div className="px-2 mb-2">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          Direct Messages ({users.length})
        </h2>
      </div>
      
      <ul className="space-y-1">
        {users.map((user) => (
          <li key={user.uid}>
            <button
              onClick={() => changeChannel(user)}
              className={`sidebar-item ${activeChannel === user.uid ? 'active' : ''}`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="truncate">
                {user.displayName || 'Anonymous'}
              </span>
              {/* Add online status indicator here */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectMessages;