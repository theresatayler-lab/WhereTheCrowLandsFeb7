import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, onClick, testId }) => {
  return (
    <motion.div
      data-testid={testId}
      onClick={onClick}
      className={`bg-card/50 backdrop-blur-md border border-border p-4 sm:p-6 md:p-8 rounded-sm transition-colors duration-500 group relative ${
        className.includes('overflow-visible') ? '' : 'overflow-hidden'
      } ${
        hover ? 'hover:border-deep-blue/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-deep-blue/10 cursor-pointer' : ''
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Art Deco corner accent - only on hover cards */}
      {hover && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-deep-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-deep-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </>
      )}
      {children}
    </motion.div>
  );
};