import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import styles from './BeforeAfterSection.module.css';

const BeforeAfterSection = ({ before_after, resultsData }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (before_after.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % before_after.length);
      }, 5000);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [before_after.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % before_after.length);
    resetInterval();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + before_after.length) % before_after.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % before_after.length);
      }, 5000);
    }
  };

  if (!before_after || before_after.length === 0) return null;

  return (
    <section className={styles.beforeAfterSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>شاهدي النتائج</span>
          <h2>نتائج <span className={styles.gold}>قبل وبعد</span></h2>
          <p>{resultsData?.description || 'صور حقيقية لعملائنا توضح الفرق المبهر'}</p>
        </div>
        
        <div className={styles.sliderContainer}>
          <button className={styles.sliderBtn} onClick={prevSlide}>
            <ChevronRight size={32} />
          </button>
          
          <div className={styles.beforeAfterSlider}>
            <div className={styles.beforeAfterImages}>
              <div className={styles.beforeImage}>
                <img src={before_after[currentIndex]?.before_image} alt="Before" />
                <span className={styles.label}>قبل</span>
              </div>
              <div className={styles.afterImage}>
                <img src={before_after[currentIndex]?.after_image} alt="After" />
                <span className={styles.label}>بعد</span>
              </div>
            </div>
            <div className={styles.itemCaption}>
              <h4>{before_after[currentIndex]?.title}</h4>
              <p>{before_after[currentIndex]?.description}</p>
            </div>
          </div>
          
          <button className={styles.sliderBtn} onClick={nextSlide}>
            <ChevronLeft size={32} />
          </button>
        </div>
        
        <div className={styles.sliderDots}>
          {before_after.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${currentIndex === idx ? styles.active : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                resetInterval();
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;