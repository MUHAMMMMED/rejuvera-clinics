import React, { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const Hero = ({ scrollToSection ,data}) => {
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
      
      {/* Background */}
      <div className={styles.heroBackground}>
        <div className={styles.backgroundVideo}>
          <img 
            src="https://images.pexels.com/photos/3845907/pexels-photo-3845907.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Luxury Clinic"
          />
        </div>
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.heroContent}>
        
        {/* Badge */}
        <div className={styles.heroBadge}>
          <span>عيادة ريجوفيرا  </span>
        </div>

        {/* Title */}
        <h1 className={styles.heroTitle}>
          تألقي بجمالٍ
          <span className={styles.goldText}> يتجاوز الحدود</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.heroSubtitle}>
          تجربة تجميلية استثنائية بأحدث التقنيات العالمية
        </p>

        {/* ✅ Buttons */}
        <div className={styles.heroActions}>
          <button 
            onClick={() => scrollToSection('services')} 
            className={styles.heroCta}
          >
            ابدئي رحلة التغيير
          </button>

          <button 
            onClick={() => scrollToSection('app')} 
            className={styles.heroApp}
          >
            تعرفي على تطبيقنا
          </button>
        </div>

        {/* Stats */}
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
        </div>

      </div>
    </section>
  );
};

export default Hero;