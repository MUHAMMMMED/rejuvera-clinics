import React from 'react';
import styles from './SliderDots.module.css';

const SliderDots = ({ 
  total, 
  currentIndex, 
  onDotClick,
  variant = 'default', // 'default', 'small', 'large'
  className = '' 
}) => {
  if (total <= 1) return null;

  return (
    <div className={`${styles.sliderDots} ${styles[variant]} ${className}`}>
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          className={`${styles.dot} ${currentIndex === idx ? styles.active : ''}`}
          onClick={() => onDotClick(idx)}
          aria-label={`Go to slide ${idx + 1}`}
          aria-current={currentIndex === idx ? 'true' : 'false'}
        />
      ))}
    </div>
  );
};

export default SliderDots;