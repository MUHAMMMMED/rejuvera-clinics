import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardHeader.module.css';

const DashboardHeader = ({ title,   showBackButton = true, customBackPath = null }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (customBackPath) {
      navigate(customBackPath);
    } else {
      navigate(-1); 
    }
  };

  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          {showBackButton && (
            <button 
              onClick={handleGoBack}
              className={styles.backButton}
              aria-label="رجوع"
              title="رجوع للصفحة السابقة"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span>رجوع</span>
            </button>
          )}
          
          <div className={styles.headerInfo}>
            {title && <h1 className={styles.title}>{title}</h1>}
 
          </div>
        </div>
 
      </div>
    </header>
  );
};

export default DashboardHeader;