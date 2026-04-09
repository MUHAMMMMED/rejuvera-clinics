import React from 'react';
import styles from './SectionHeader.module.css';

const SectionHeader = ({ 
  badge, 
  title, 
  subtitle, 
  alignment = 'center',
  className = '' 
}) => {
  return (
    <div className={`${styles.sectionHeader} ${styles[alignment]} ${className}`}>
      {badge && (
        <span className={styles.sectionBadge}>{badge}</span>
      )}
      {title && (
        <h2 className={styles.sectionTitle}>{title}</h2>
      )}
      {subtitle && (
        <p className={styles.sectionSubtitle}>{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;