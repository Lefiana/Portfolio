// app/components/AboutPreview.tsx

"use client";

import React from 'react';
import Link from 'next/link';

interface AboutPreviewProps {
  info: {
    photo_url: string;
    long_bio: string;
  };
}

const AboutPreview: React.FC<AboutPreviewProps> = ({ info }) => {
    // 1. Split the long_bio into paragraphs based on double newlines
    const paragraphs = (info.long_bio || '').split('\n\n').filter(p => p.trim() !== '');

    return (
        // Grid container for image and text
        <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* Left Column (Image) */}
            <div className="md:col-span-1 flex justify-center">
                <img
                    // 2. Use the dynamic photo_url from the API
                    src={info.photo_url}
                    alt="A professional photo"
                    className="rounded-xl w-full max-w-xs md:max-w-none shadow-xl object-cover aspect-square"
                />
            </div>

            {/* Right Column (Text) */}
            <div className="md:col-span-2">
                {/* 3. Map over the parsed paragraphs to render them dynamically */}
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                    </p>
                ))}

                {/* "Read more" link */}
                <Link href="/about" className="text-indigo-600 hover:underline mt-2 block font-medium">
                    Learn more about my journey →
                </Link>
            </div>
        </div>
    );
};

export default AboutPreview;