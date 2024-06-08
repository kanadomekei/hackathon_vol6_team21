// FloatingButton.tsx
import React, { FC } from 'react';

interface FloatingButtonProps {
  handleOpen: () => void;
}

const FloatingButton: FC<FloatingButtonProps> = ({ handleOpen }) => {
  return (
    <div className="absolute bottom-10 right-20">
      <button className="w-[80px] h-[80px] bg-green-500 rounded-full flex items-center justify-center" onClick={handleOpen}>
        <span className='text-white mb-2 text-6xl'>+</span>
      </button>
    </div>
  );
};

export default FloatingButton;
