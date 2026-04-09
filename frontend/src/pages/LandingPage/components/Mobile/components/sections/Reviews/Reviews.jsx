import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import styles from './Reviews.module.css';

const Reviews = ({ items, currentIndex, onIndexChange }) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (items.length > 1) {
      intervalRef.current = setInterval(() => {
        onIndexChange((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [items.length, onIndexChange]);

  const next = () => {
    onIndexChange((prev) => (prev + 1) % items.length);
    resetInterval();
  };

  const prev = () => {
    onIndexChange((prev) => (prev - 1 + items.length) % items.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        onIndexChange((prev) => (prev + 1) % items.length);
      }, 5000);
    }
  };

  if (!items.length) return null;

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionBadge}>آراء العملاء</span>
      </div>
      
      <div className={styles.reviewSlider}>
        <button className={styles.reviewNav} onClick={prev}>
          <ChevronRight size={20} />
        </button>
        
        <div className={styles.reviewCard}>
          {items[currentIndex] && (
            <>
              <div className={styles.reviewImage}>
                <img 
                  src={items[currentIndex].image} 
                  alt="Review" 
                />
              </div>
              <div className={styles.reviewOverlay}>
                <ImageIcon size={24} />
                <span>صورة من التقييم</span>
              </div>
            </>
          )}
        </div>
        
        <button className={styles.reviewNav} onClick={next}>
          <ChevronLeft size={20} />
        </button>
      </div>
      
      <div className={styles.sliderDots}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${currentIndex === idx ? styles.active : ''}`}
            onClick={() => onIndexChange(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default Reviews;