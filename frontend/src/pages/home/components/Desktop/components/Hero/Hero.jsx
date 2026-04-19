import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const Hero = ({ scrollToSection }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroRef.current.style.setProperty('--mouse-x', x);
      heroRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className={styles.hero} ref={heroRef}>
      {/* خلفية الفيديو المتحركة */}
      <div className={styles.heroBackground}>
        <div className={styles.backgroundVideo}>
          <img 
            src="https://images.pexels.com/photos/3845907/pexels-photo-3845907.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Rejuvera Clinics"
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.gradientOverlay} />
        
        {/* عناصر زخرفية متحركة - إصلاح className */}
        <div className={`${styles.particle} ${styles.particle1}`} />
        <div className={`${styles.particle} ${styles.particle2}`} />
        <div className={`${styles.particle} ${styles.particle3}`} />
        <div className={`${styles.particle} ${styles.particle4}`} />
      </div>

      <div className={styles.heroContent}>
        {/* شارة مميزة */}
        <div className={styles.heroBadge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
          </svg>
          <span>مركز ريجوفيرا الطبي </span>
        </div>

        {/* العنوان الرئيسي */}
        <h1 className={styles.heroTitle}>
          تألقي بجمالٍ
          <span className={styles.goldText}> يتجاوز الحدود</span>
        </h1>

        {/* الوصف */}
        <p className={styles.heroSubtitle}>
          تجربة تجميلية استثنائية بأحدث التقنيات العالمية<br />
          مع نخبة من أفضل الأطباء الاستشاريين
        </p>

        {/* مجموعة أزرار */}
        <div className={styles.heroActions}>
          <button onClick={() => scrollToSection('services')} className={styles.heroCta}>
            <span>ابدئي رحلة التغيير</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          
          <button onClick={() => scrollToSection('doctors')} className={styles.heroSecondary}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>تعرفي على أطبائنا</span>
          </button>
        </div>

        {/* إحصائيات سريعة */}
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+15</span>
            <span className={styles.statLabel}>سنة خبرة</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+5000</span>
            <span className={styles.statLabel}>عملية ناجحة</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+20</span>
            <span className={styles.statLabel}>طبيب استشاري</span>
          </div>
        </div>
      </div>

      {/* مؤشر التمرير */}
      <div className={styles.heroScrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span className={styles.scrollText}>اسحب للأسفل</span>
      </div>
    </section>
  );
};

export default Hero;