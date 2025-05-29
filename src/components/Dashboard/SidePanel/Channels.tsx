import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { setCurrentChannel, setPrivateChannel, setUserChannels } from '../../../redux/actions/channelActions';
import { RootState } from '../../../redux/store';
import { Channel } from '../../../types';
import { Hash, Plus, X } from 'lucide-react';

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentChannel } = useSelector((state: RootState) => state.channel);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsRef = collection(db, 'channels');
        const querySnapshot = await getDocs(channelsRef);
        const channelsList: Channel[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Channel, 'id'>;
          channelsList.push({
            id: doc.id,
            ...data
          });
        });
        
        setChannels(channelsList);
        dispatch(setUserChannels(channelsList));
        
        // Set first channel as active if none is selected
        if (channelsList.length > 0 && !currentChannel) {
          changeChannel(channelsList[0]);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    
    fetchChannels();
    
    const channelsRef = collection(db, 'channels');
    const unsubscribe = onSnapshot(channelsRef, (snapshot) => {
      const channelsList: Channel[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Channel, 'id'>;
        channelsList.push({
          id: doc.id,
          ...data
        });
      });
      
      setChannels(channelsList);
      dispatch(setUserChannels(channelsList));
    });
    
    return () => unsubscribe();
  }, [dispatch, currentChannel]);

  const changeChannel = (channel: Channel) => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
    navigate(`/channel/${channel.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setLoading(true);
      try {
        const newChannel = {
          name: channelName,
          description: channelDetails,
          createdBy: {
            name: currentUser?.displayName || 'Anonymous',
            avatar: currentUser?.photoURL || '',
            id: currentUser?.uid || ''
          },
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'channels'), newChannel);
        setModal(false);
        setChannelName('');
        setChannelDetails('');
      } catch (error) {
        console.error('Error creating channel:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const isFormValid = () => {
    return channelName && channelDetails;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          Channels ({channels.length})
        </h2>
        <button
          onClick={() => setModal(true)}
          className="text-neutral-500 hover:text-primary-500 transition-colors duration-200"
          title="Add Channel"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <ul className="space-y-1">
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              onClick={() => changeChannel(channel)}
              className={`sidebar-item ${currentChannel?.id === channel.id ? 'active' : ''}`}
            >
              <Hash className="h-4 w-4 mr-2" />
              <span className="truncate">{channel.name}</span>
            </button>
          </li>
        ))}
      </ul>
      
      {/* Add Channel Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add a Channel</h3>
              <button onClick={() => setModal(false)}>
                <X className="h-5 w-5 text-neutral-500 hover:text-neutral-700" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="channelName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  id="channelName"
                  className="input"
                  placeholder="e.g. general"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="channelDetails" className="block text-sm font-medium text-neutral-700 mb-1">
                  Channel Description
                </label>
                <input
                  type="text"
                  id="channelDetails"
                  className="input"
                  placeholder="e.g. Company-wide announcements and news"
                  value={channelDetails}
                  onChange={(e) => setChannelDetails(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className={`btn btn-primary ${(loading || !isFormValid()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Creating...' : 'Add Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;