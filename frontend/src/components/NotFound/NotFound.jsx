import { Home, Search } from 'lucide-react';
import React from 'react';
import './NotFound.css';

const NotFound = ({ 
  onGoHome = null,
  onSearch = null
}) => {
  
  return (
    <div className="notfound-root">
      <div className="notfound-inner">
        <div className="notfound-icon">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="notfound-code">404</h1>
        <p className="notfound-text">الصفحة غير موجودة</p>
        <div className="notfound-actions">
          <button 
            className="notfound-btn-home"
            onClick={() => onGoHome ? onGoHome() : window.location.href = '/'}
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </button>
          {onSearch && (
            <button 
              className="notfound-btn-search"
              onClick={onSearch}
            >
              <Search size={16} />
              <span>بحث</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;