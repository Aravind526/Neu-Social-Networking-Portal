import React from 'react';
import { Channel } from '../../../types';
import { Info, Users, Star } from 'lucide-react';

interface MetaPanelProps {
  currentChannel: Channel;
}

const MetaPanel: React.FC<MetaPanelProps> = ({ currentChannel }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          About #{currentChannel.name}
        </h3>
        <p className="text-neutral-600">{currentChannel.description}</p>
      </div>
      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Details
        </h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-neutral-500">Created by</span>
            <div className="flex items-center mt-1">
              <img
                src={currentChannel.createdBy.avatar}
                alt={currentChannel.createdBy.name}
                className="h-6 w-6 rounded-full mr-2"
              />
              <span className="text-sm font-medium text-neutral-900">
                {currentChannel.createdBy.name}
              </span>
            </div>
          </div>
          <div>
            <span className="text-sm text-neutral-500">Created on</span>
            <div className="text-sm font-medium text-neutral-900 mt-1">
              {new Date(currentChannel.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Top Contributors
        </h4>
        <div className="space-y-2">
          {/* Placeholder for top contributors - to be implemented */}
          <p className="text-sm text-neutral-500">No contributors yet</p>
        </div>
      </div>
    </div>
  );
};

export default MetaPanel;