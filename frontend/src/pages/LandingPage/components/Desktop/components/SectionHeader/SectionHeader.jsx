import React from 'react';
import styles from './SectionHeader.module.css';

const SectionHeader = ({ badge, title, highlightText, description }) => {
  return (
    <div className={styles.sectionHeader}>
      {badge && <span className={styles.sectionBadge}>{badge}</span>}
      <h2>
        {title}{' '}
        {highlightText && <span className={styles.gold}>{highlightText}</span>}
      </h2>
      {description && <p>{description}</p>}
    </div>
  );
};

export default SectionHeader;