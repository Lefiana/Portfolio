"use client";

import React from "react";
import Section from "./Section";

interface HeroSectionProps {
  info: {
    name: string;
    tagline: string;
    github_url: string;
    linkedin_url: string;
    resume_url: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ info }) => (
  <Section className="h-[75vh] pt-32 flex flex-col items-center justify-start text-center !bg-transparent relative overflow-hidden ">
    {/* Background Image: Now via external CSS class */}
    <div className="hero-bg absolute inset-0" />  {/* Subtle opacity from CSS */}

    {/* Decorative Elements: Positioned absolutely behind content */}
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Tiny Circles: Scattered "randomly" with subtle float animation */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-indigo-200 rounded-full opacity-30 animate-pulse hidden md:block"></div>  {/* Top-left dot */}
      <div className="absolute top-20 right-20 w-3 h-3 bg-gray-300 rounded-full opacity-20 animate-bounce [animation-delay:1000ms] hidden md:block"></div>  {/* Top-right small dot; Note: Tailwind doesn't have delay-1000, use [animation-delay] */}
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-indigo-100 rounded-full opacity-25 animate-float md:block"></div>  {/* Bottom-left-ish */}
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-gray-400 rounded-full opacity-15 animate-pulse [animation-delay:500ms] hidden md:block"></div>  {/* Bottom-right dot */}
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-indigo-300 rounded-full opacity-10 animate-bounce block md:hidden"></div>  {/* Mobile-only subtle */}

      {/* Cogwheels/Gears: Simple SVGs with slow rotation - Tech theme */}
      {/* Top-left Cog */}
      <svg 
        className="absolute top-16 left-16 w-12 h-12 text-gray-300 opacity-20 animate-spin-slow z-0 hidden md:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>

      {/* Bottom-right Cog */}
      <svg 
        className="absolute bottom-16 right-16 w-10 h-10 text-indigo-200 opacity-15 animate-spin-slow-reverse z-0 hidden md:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>

      {/* Optional: Center-edge Cog (subtle, slower) */}
      <svg 
        className="absolute top-1/3 right-8 w-8 h-8 text-gray-400 opacity-10 animate-spin-slow z-0 hidden lg:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>

    {/* Content: Centered, above decorations (z-10) */}
    <div className="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl px-4">
      <h1 className="text-6xl md:text-7xl text-gray-800 font-extrabold mb-4 leading-tight">
        {info.name || 'Your Name'} 
      </h1>

      <p className="text-xl md:text-2xl text-indigo-600 max-w-xl mb-12 font-medium">
        {info.tagline || 'Your Tagline'}    
      </p>

      <div className="flex space-x-4">
        <a 
          href={info.github_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition duration-300 shadow-md hover:shadow-lg"
        >
          GitHub
        </a>
        <a 
          href={info.linkedin_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300"
        >
          LinkedIn
        </a>
        <a 
          href={info.resume_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-gray-600 text-gray-600 font-semibold rounded-lg hover:text-gray-900 hover:bg-gray-100 transition duration-300 shadow-md"
        >
          View Resume
        </a>
      </div>
    </div>

    <div className="absolute inset-0 pointer-events-none z-0">
    </div>

    <hr className="w-1/3 mx-auto border-t-2 border-gray-300 absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10" />
  </Section>
);

export default HeroSection;