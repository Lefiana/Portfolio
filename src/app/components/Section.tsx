"use client";  // Required for Framer Motion (client-side animations)

import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
  // New: Animation controls (optional)
  delay?: number;  // Delay in seconds (e.g., 0.2 for stagger)
  animationVariant?: 'fade-up' | 'slide-left' | 'scale-in' | 'none';  // Preset variants (default: fade-up)
}

export default function Section({ 
  id, 
  title, 
  className, 
  children, 
  delay = 0, 
  animationVariant = 'fade-up'
}: SectionProps) {
  // Respect reduced motion (accessibility)
  const prefersReducedMotion = typeof window !== 'undefined' ? 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  
  const shouldAnimate = !prefersReducedMotion && animationVariant !== 'none';

  // Animation variants (customize as needed)
  const variants = {
    'fade-up': {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut", delay },
    },
    'slide-left': {
      initial: { opacity: 0, x: -50 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.7, ease: "easeOut", delay },
    },
    'scale-in': {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, ease: "easeOut", delay },
    },
    'none':{
      initial: undefined,  // No initial animation (already visible)
      whileInView: undefined,  // No whileInView trigger
      transition: { duration: 0, delay: 0 },  // Instant (no transition)
    },
  };

  const { initial, whileInView, transition } = variants[animationVariant] || variants['fade-up'];

  const base = "py-16 px-8 border-b border-gray-200 bg-transparent text-gray-800";

  return (
    <motion.section
      id={id}
      className={`${base} ${className ?? ""}`.trim()}
      initial={shouldAnimate ? initial : undefined}
      whileInView={shouldAnimate ? whileInView : undefined}
      viewport={{ once: true, margin: "-100px" }}  // Trigger early, animate once
      transition={shouldAnimate ? transition : { duration: 0 }}
    >
      {title && (
        <motion.h2 
          className="text-5xl font-bold mb-4 text-indigo-400"
          initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : undefined}
          whileInView={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
          transition={shouldAnimate ? { duration: 0.4, delay: delay + 0.1 } : { duration: 0 }}
        >
          {title}
        </motion.h2>
      )}
      {children}
    </motion.section>
  );
}
