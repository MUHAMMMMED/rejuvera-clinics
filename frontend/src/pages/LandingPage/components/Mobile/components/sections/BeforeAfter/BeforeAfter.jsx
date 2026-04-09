import React, { useEffect, useRef, useState } from 'react';
import styles from './BeforeAfter.module.css';

const BeforeAfter = ({ items }) => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isShowingBefore, setIsShowingBefore] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  if (!items || items.length === 0) return null;

  // تنظيف الـ intervals عند إلغاء تحميل الكمبوننت
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // بدء التشغيل التلقائي
  useEffect(() => {
    startAutoSequence();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [items.length]);

  const startAutoSequence = () => {
    let currentPair = 0;
    let showingBefore = true;

    const runSequence = () => {
      // عرض الصورة الحالية (قبل أو بعد)
      setCurrentPairIndex(currentPair);
      setIsShowingBefore(showingBefore);
      setIsTransitioning(false);

      // بعد ثانية، نبدأ التلاشي للصورة التالية
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);
        
        // بعد 0.5 ثانية (وقت التلاشي)، نغير الصورة
        setTimeout(() => {
          if (showingBefore) {
            // إذا كانت تعرض "قبل"، نعرض "بعد" لنفس الزوج
            showingBefore = false;
          } else {
            // إذا كانت تعرض "بعد"، ننتقل للزوج التالي ونعرض "قبل"
            showingBefore = true;
            currentPair = (currentPair + 1) % items.length;
          }
          
          // تحديث الحالة
          setCurrentPairIndex(currentPair);
          setIsShowingBefore(showingBefore);
          setIsTransitioning(false);
          
          // الاستمرار في التسلسل
          timeoutRef.current = setTimeout(runSequence, 1500);
        }, 500);
      }, 1500);
    };

    runSequence();
  };

  const currentItem = items[currentPairIndex];

  return (
    <section id="results" className={styles.resultsSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionBadge}>النتائج</span>
        <h2 className={styles.sectionTitle}>
          قبل <span className={styles.gold}>وبعد</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          شاهد الفرق بنفسك - صور تتغير تلقائياً
        </p>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.imageWrapper}>
          <div 
            className={`${styles.imageCard} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
          >
            <img 
              src={isShowingBefore ? currentItem.before_image : currentItem.after_image} 
              alt={isShowingBefore ? "قبل" : "بعد"}
              className={styles.fullImage}
            />
            <div className={`${styles.imageLabel} ${isShowingBefore ? styles.beforeLabel : styles.afterLabel}`}>
              <span>{isShowingBefore ? 'قبل' : 'بعد'}</span>
            </div>
          </div>
        </div>

        {/* معلومات الصورة الحالية */}
        <div className={styles.imageInfo}>
          <h3>{currentItem.title}</h3>
          <p>{currentItem.description}</p>
        </div>

        {/* مؤشر التقدم */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            {items.map((_, idx) => (
              <div 
                key={idx}
                className={`${styles.progressSegment} ${idx === currentPairIndex ? styles.active : ''}`}
              >
                <div className={styles.progressFill}></div>
              </div>
            ))}
          </div>
          <div className={styles.progressText}>
            {currentPairIndex + 1} / {items.length}
          </div>
        </div>

        {/* أزرار التحكم اليدوي */}
        <div className={styles.controls}>
          <button 
            className={styles.controlBtn}
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              // إعادة تعيين التسلسل
              setCurrentPairIndex((prev) => (prev - 1 + items.length) % items.length);
              setIsShowingBefore(true);
              startAutoSequence();
            }}
          >
            السابق
          </button>
          <button 
            className={styles.controlBtn}
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              // إعادة تعيين التسلسل
              setCurrentPairIndex((prev) => (prev + 1) % items.length);
              setIsShowingBefore(true);
              startAutoSequence();
            }}
          >
            التالي
          </button>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;