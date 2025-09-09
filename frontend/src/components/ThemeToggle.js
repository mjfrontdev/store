import React from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = '', size = 'sm' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={isDarkMode ? 'outline-light' : 'outline-dark'}
        size={size}
        onClick={toggleTheme}
        className={`theme-toggle-btn ${className}`}
        style={{
          border: 'none',
          background: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          padding: '8px 12px',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.div
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <FiSun size={18} className="text-warning" />
          ) : (
            <FiMoon size={18} className="text-primary" />
          )}
        </motion.div>
        <span className="ms-2">
          {isDarkMode ? 'روز' : 'شب'}
        </span>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
