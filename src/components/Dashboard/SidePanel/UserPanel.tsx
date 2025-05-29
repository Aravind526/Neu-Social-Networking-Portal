import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { User as UserType } from '../../../types';
import { User, LogOut, Settings } from 'lucide-react';

interface UserPanelProps {
  currentUser: UserType | null;
}

const UserPanel: React.FC<UserPanelProps> = ({ currentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const goToProfile = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  return (
    <div className="px-4 mb-6">
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 w-full rounded-md px-3 py-2 text-left focus:outline-none hover:bg-neutral-100 transition-colors duration-200"
        >
          <div className="flex-shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-700" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {currentUser?.email || ''}
            </p>
          </div>
          <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20">
            <button
              onClick={goToProfile}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </button>
            
            <button
              onClick={handleSignout}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;