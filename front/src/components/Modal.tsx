// Modal.tsx
import React, { FC, useEffect, useRef } from 'react';
import Upload from './Upload';

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, handleClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg" ref={modalRef}>
            <span className="close cursor-pointer text-black" onClick={handleClose}>&times;</span>
            <h2 className="text-xl font-bold mb-4">モーダルウィンドウ</h2>
            <Upload />
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
