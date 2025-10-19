"use client";

import React, { useState } from 'react';
import CertificateModal from './CertificateModal';

// 1. Corrected Interface: Added the 'id' field
interface AchievementItem {
    id: number;
    title: string;
    issuer: string;
    type: 'certificate' | 'award';
    image_url: string; 
    date?: string; 
    credential_url?: string;
}

interface AchievementSectionProps {
    achievements: AchievementItem[];
}

// 2. Corrected Component Structure: Hooks at the top level
const CertificatesSection: React.FC<AchievementSectionProps> = ({ achievements = []}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Corrected state type to hold a single AchievementItem
    const [currentCert, setCurrentCert] = useState<AchievementItem | null>(null);

    // Corrected function to accept a single AchievementItem
    const openModal = (cert: AchievementItem) => {
        // console.log('Opening modal for cert:', cert);  // Add this: Log the full cert object
        setCurrentCert(cert);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCert(null);
    };

    const hoverColors = [
    'hover:border-indigo-500', // Color 1
    'hover:border-red-500',    // Color 2
    'hover:border-green-500',  // Color 3 (your original)
    'hover:border-yellow-500', // Color 4
    'hover:border-pink-500',   // Color 5
    'hover:border-cyan-500',   // Color 6
    ]

return (
    <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 !bg-transparent">
            {/* Converted .map() to use block syntax ({}) 
              so we can declare the colorClass variable.
              Requires an explicit 'return' inside the block.
            */}
            {achievements.map((item, index) => { 
                
                // 1. Logic inside the block scope
                const colorClass = hoverColors[index % hoverColors.length]; 
                
                // 2. Explicit return of JSX
                return (
                    <div
                        key={item.id}
                        onClick={() => openModal(item)}
                        // Use a template literal to inject the dynamic color class
                        className={`
                            rounded-xl 
                            bg-white/50
                            border-b-4 
                            border-transparent 
                            shadow-lg 
                            p-4 
                            text-center 
                            text-gray-800 
                            font-semibold
                            ${colorClass}  
                            hover:-translate-y-1 
                            hover:shadow-2xl 
                            transition 
                            duration-500 
                            ease-out 
                            cursor-pointer
                        `.trim()}
                    >
                        <div className="text-lg mb-1">
                            {item.type === 'award' ? '🏆 ' : ''}
                            {item.title}
                        </div>
                        <div className="text-sm text-gray-500">{item.issuer}</div>
                    </div>
                );
            })}
        </div>

        {/* Render the modal conditionally */}
        {currentCert && (
            <CertificateModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={currentCert.title}
                image_url={currentCert.image_url}
                credential_url={currentCert.credential_url}
            />
        )}
    </div>
);
};

export default CertificatesSection;