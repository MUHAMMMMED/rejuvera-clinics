import React from 'react';
import './LoadingSpinner.css';
import logo from './logo.png';

const LoadingSpinner = ({ 
  message = 'جاري التحميل...', 
  fullPage = false,
  size = 'medium', // 'small', 'medium', 'large', 'xlarge'
  variant = 'default' // 'default', 'minimal', 'pulse', 'ripple'
}) => {
  return (
    <div 
      className={`loading-spinner-container ${fullPage ? 'full-page' : ''}`}
      role="progressbar"
      aria-label={message}
      aria-busy="true"
    >
      <div className={`loading-spinner ${size} ${variant}`}>
        <div className="spinner-brand-wrapper">
          {/* Glassmorphism Background Effect */}
          <div className="spinner-glass-bg"></div>
          
          {/* Animated Gradient Orbs */}
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          
          {/* Logo Container with Animation */}
          <div className="logo-container">
            <img 
              src={logo}
              alt="" 
              className="spinner-logo"
              aria-hidden="true"
            />
            {/* Ripple Effects */}
            <div className="ripple-ring ring-1"></div>
            <div class="ripple-ring ring-2"></div>
            <div className="ripple-ring ring-3"></div>
          </div>
          
          {/* Rotating Track */}
          <svg className="spinner-track" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c5a028" />
                <stop offset="50%" stopColor="#c5a028" />
                <stop offset="100%" stopColor="#c5a028" />
              </linearGradient>
            </defs>
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="url(#brandGradient)" 
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              className="track-circle"
            />
          </svg>
        </div>
        
        {/* Message with Typing Effect */}
        {message && (
          <div className="message-wrapper">
            <p className="loading-message">
              {message}
              <span className="typing-dots">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </span>
            </p>
            {fullPage && (
              <p className="loading-submessage">نحن نجهز لك أفضل تجربة</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;