import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p>جاري تحميل معلومات الخدمة...</p>
    </div>
  );
};

export default LoadingSpinner;