import React from 'react';
import styles from './SkeletonLoader.module.css';

/**
 * SkeletonLoader Component - عرض شاشة تحميل مؤقتة أثناء جلب البيانات
 * @param {string} type - نوع السكيليتون: 'card', 'list', 'table', 'details'
 * @param {number} count - عدد العناصر المراد عرضها
 * @param {string} variant - متغير إضافي للتحكم في الشكل
 */

const SkeletonLoader = ({ 
  type = 'card', 
  count = 4,
  variant = 'default'
}) => {
  
  // سكيليتون للكاردات (مناسب للداشبورد، التحليلات، المعرض)
  const renderCardSkeleton = () => {
    return (
      <div className={styles.skeletonGrid}>
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonTextShort}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // سكيليتون للقائمة (مناسب للمواعيد، الأطباء، التصنيفات، الخدمات، الباقات)
  const renderListSkeleton = () => {
    return (
      <div className={styles.skeletonListContainer}>
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className={styles.skeletonListItem}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonListContent}>
              <div className={styles.skeletonListTitle}></div>
              <div className={styles.skeletonListSubtitle}></div>
            </div>
            <div className={styles.skeletonListAction}></div>
          </div>
        ))}
      </div>
    );
  };

  // سكيليتون للجدول (مناسب للتتبع والتقارير)
  const renderTableSkeleton = () => {
    return (
      <div className={styles.skeletonTableContainer}>
        <div className={styles.skeletonTableHeader}>
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className={styles.skeletonTableHeaderCell}></div>
          ))}
        </div>
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className={styles.skeletonTableRow}>
            {Array(4).fill(0).map((_, colIndex) => (
              <div key={colIndex} className={styles.skeletonTableCell}></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // سكيليتون للتفاصيل (مناسب لمعلومات الموقع)
  const renderDetailsSkeleton = () => {
    return (
      <div className={styles.skeletonDetailsContainer}>
        <div className={styles.skeletonDetailsHeader}></div>
        <div className={styles.skeletonDetailsSection}>
          <div className={styles.skeletonDetailsTitle}></div>
          <div className={styles.skeletonDetailsText}></div>
          <div className={styles.skeletonDetailsText}></div>
          <div className={styles.skeletonDetailsTextShort}></div>
        </div>
        <div className={styles.skeletonDetailsSection}>
          <div className={styles.skeletonDetailsTitle}></div>
          <div className={styles.skeletonDetailsText}></div>
          <div className={styles.skeletonDetailsText}></div>
        </div>
      </div>
    );
  };

  // اختيار نوع السكيليتون المناسب
  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return renderListSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'details':
        return renderDetailsSkeleton();
      case 'card':
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div className={`${styles.skeletonWrapper} ${styles[variant]}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;