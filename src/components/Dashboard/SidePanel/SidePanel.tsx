import React from 'react';
import { User } from '../../../types';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from '../DirectMessages/DirectMessages';
import Starred from './Starred';

interface SidePanelProps {
  currentUser: User | null;
}

const SidePanel: React.FC<SidePanelProps> = ({ currentUser }) => {
  return (
    <div className="h-full flex flex-col py-4">
      <UserPanel currentUser={currentUser} />
      <div className="flex-1 overflow-y-auto px-2">
        <Starred />
        <Channels />
        <DirectMessages currentUser={currentUser} />
      </div>
    </div>
  );
};

export default SidePanel;