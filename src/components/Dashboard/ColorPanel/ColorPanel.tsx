import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Palette } from 'lucide-react';

const ColorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const colors = [
    { primary: '#D41B2C', secondary: '#000000' },
    { primary: '#2563EB', secondary: '#1E40AF' },
    { primary: '#059669', secondary: '#065F46' },
    { primary: '#7C3AED', secondary: '#5B21B6' },
    { primary: '#DB2777', secondary: '#9D174D' },
  ];

  const handleColorChange = (primary: string, secondary: string) => {
    dispatch({
      type: 'SET_COLORS',
      payload: {
        primaryColor: primary,
        secondaryColor: secondary
      }
    });
  };

  return (
    <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-20 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-white p-2 rounded-l-md shadow-md"
      >
        <Palette className="h-5 w-5 text-neutral-600" />
      </button>
      
      <div className="bg-white p-4 shadow-lg rounded-l-md">
        <h3 className="text-sm font-semibold text-neutral-700 mb-3">
          Choose Theme
        </h3>
        
        <div className="space-y-2">
          {colors.map(({ primary, secondary }, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(primary, secondary)}
              className="w-full flex items-center space-x-2 p-2 hover:bg-neutral-50 rounded-md transition-colors duration-200"
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
                style={{ backgroundColor: primary }}
              />
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
                style={{ backgroundColor: secondary }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPanel;