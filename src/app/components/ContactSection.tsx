"use client";

import React, { useState } from 'react';

interface ContactInfo {
  contact_email?: string;
  linkedin_url?: string;
  github_url?: string;
}

interface ContactSectionProps {
  contactInfo?: ContactInfo;  // From server (personalInfo)
}

const ContactSection: React.FC<ContactSectionProps> = ({ contactInfo }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Fallbacks for missing data
  const email = contactInfo?.contact_email || 'seanteja@gmail.com';
  const linkedinUrl = contactInfo?.linkedin_url || '#';  // Or 'https://linkedin.com/in/yourprofile'
  const githubUrl = contactInfo?.github_url || '#';  // Or 'https://github.com/yourusername'

  // Show loading/error if no contactInfo (e.g., server fetch failed)
  if (!contactInfo || Object.keys(contactInfo).length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Contact information is loading or not available.{' '}
        <button 
          onClick={() => window.location.reload()} 
          className="text-indigo-400 hover:underline"
        >
          Refresh page
        </button>
        .
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await fetch('/api/v1/contacts', {  // Relative path is fine
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);  // Auto-clear success
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 py-8">
      {/* LEFT COLUMN: Contact Form */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-white">Send Me a Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="sr-only">Your Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="sr-only">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              disabled={status === 'sending'}
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-gray-800 text-white placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="mt-4 text-center text-green-400 text-sm font-medium">
            Message sent successfully! I'll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-center text-red-400 text-sm">
            {errorMsg}
          </p>
        )}
      </div>

      {/* RIGHT COLUMN: Contact Info */}
      <div className="md:mt-0 mt-8">
        <h3 className="text-2xl font-semibold mb-6 text-white">Contact Details</h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="text-indigo-400 text-xl h-5 w-5 flex-shrink-0" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <a href={`mailto:${email}`} className="text-gray-300 hover:text-indigo-400 transition duration-300">
              {email}
            </a>
          </div>
          
          {/* LinkedIn - Fixed SVG (actual LinkedIn icon path) */}
          {linkedinUrl !== '#' && (
            <div className="flex items-center space-x-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-indigo-400 text-xl h-5 w-5 flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-400 transition duration-300"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          
          {/* GitHub */}
          {githubUrl !== '#' && (
            <div className="flex items-center space-x-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="text-indigo-500 text-xl h-5 w-5 flex-shrink-0" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.5a6.69 6.69 0 0 0-6 0c-2.73-1.85-3.91-.5-3.91-.5A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0 1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 18 13.13V17"></path>
              </svg>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-indigo-400 transition duration-300"
              >
                GitHub Profile
              </a>
            </div>
          )}
          
          <p className="pt-4 text-gray-400 text-sm">
            I aim to respond to all inquiries within 24-48 hours. Let's build something great!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
