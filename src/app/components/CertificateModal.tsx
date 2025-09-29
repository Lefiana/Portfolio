// app/components/CertificateModal.tsx

"use client";

import React from 'react';

// 1. Corrected interface to match the API data and added the optional credentialUrl
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image_url: string; // Corrected to match our API and avoid a type error
  credential_url?: string; // This prop is now accepted and is optional
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, title, image_url, credential_url }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300"
      onClick={onClose} // Close modal when clicking outside
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-11/12 max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* Image Body */}
        <div className="p-4 overflow-y-auto max-h-[80vh]">
          <img src={image_url} alt={title} className="w-full h-auto object-contain" />
        </div>

        {/* 2. Conditionally render the credential button if the URL exists */}
        {credential_url && (
          <div className="p-4 border-t text-center">
            <a 
              href={credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              View Credential &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateModal;