import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ show, imageUrl, altText, onClose }) => {
  if (!show || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;