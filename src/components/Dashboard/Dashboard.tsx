import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { RootState } from '../../redux/store';

// Components
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import DirectMessages from './DirectMessages/DirectMessages';
import UserProfile from './UserProfile/UserProfile';
import ColorPanel from './ColorPanel/ColorPanel';

const Dashboard: React.FC = () => {
  const { sidebarVisible } = useSelector((state: RootState) => state.ui);
  const { currentChannel, isPrivateChannel } = useSelector((state: RootState) => state.channel);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when a route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentChannel]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary shadow-sm z-10">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            {/* Logo with white background to stand out on red header */}
            <div className="bg-white rounded-full p-1 mr-2">
              <img
                src={`${import.meta.env.BASE_URL}ne-logo.svg`}
                alt="Northeastern Logo"
                className="h-6 w-6"
              />
            </div>
            <h1 className="text-white font-bold text-xl">NEU Social</h1>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidePanel currentUser={currentUser} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-white shadow-md z-10 overflow-y-auto flex-shrink-0 hidden md:block ${sidebarVisible ? '' : 'hidden'}`}>
          <SidePanel currentUser={currentUser} />
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          <Routes>
            <Route path="/" element={<Messages />} />
            <Route path="/channel/:id" element={<Messages />} />
            <Route path="/direct/:id" element={<DirectMessages />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

        {/* Meta Panel */}
        {currentChannel && !isPrivateChannel && (
          <aside className="w-64 bg-white shadow-md overflow-y-auto flex-shrink-0 hidden lg:block">
            <MetaPanel currentChannel={currentChannel} />
          </aside>
        )}

        {/* Color Panel */}
        <ColorPanel />
      </div>
    </div>
  );
};

export default Dashboard;