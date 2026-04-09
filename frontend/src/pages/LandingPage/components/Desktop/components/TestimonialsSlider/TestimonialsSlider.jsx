import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './TestimonialsSlider.module.css';

const TestimonialsSlider = ({ reviews = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 3;
  
  // إنشاء نسخة مكررة من الصور للحصول على تأثير لا نهائي
  const createInfiniteArray = (arr) => {
    if (!arr || arr.length === 0) return [];
    // نكرر المصفوفة 3 مرات لخلق تأثير لا نهائي سلس
    return [...arr, ...arr, ...arr];
  };
  
  const infiniteReviews = createInfiniteArray(reviews);
  const originalLength = reviews.length;
  const startIndex = originalLength; // نبدأ من منتصف المصفوفة المكررة
  
  // حساب الصور المعروضة حالياً
  const getVisibleReviews = () => {
    if (infiniteReviews.length === 0) return [];
    return infiniteReviews.slice(currentIndex, currentIndex + itemsPerPage);
  };
  
  const visibleReviews = getVisibleReviews();

  // دالة للانتقال للسلايد التالي مع تأثير لا نهائي
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setCurrentIndex((prev) => prev + 1);
    
    // إعادة تعيين المؤشر عندما نصل إلى نسخة مكررة
    setTimeout(() => {
      if (currentIndex + 1 >= infiniteReviews.length - itemsPerPage) {
        setIsTransitioning(false);
        setCurrentIndex(startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, infiniteReviews.length, itemsPerPage, startIndex]);

  // دالة للانتقال للسلايد السابق مع تأثير لا نهائي
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setCurrentIndex((prev) => prev - 1);
    
    setTimeout(() => {
      if (currentIndex - 1 < 0) {
        setIsTransitioning(false);
        setCurrentIndex(infiniteReviews.length - itemsPerPage - startIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 500);
  }, [currentIndex, isTransitioning, infiniteReviews.length, itemsPerPage, startIndex]);

  // Auto-play: تغيير الصور كل 3 ثواني
  useEffect(() => {
    if (!reviews.length) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // تغيير كل 3 ثواني
    
    return () => clearInterval(interval);
  }, [nextSlide, reviews.length]);

  // إعادة تعيين المؤشر عند تغيير البيانات
  useEffect(() => {
    if (reviews.length > 0) {
      setCurrentIndex(startIndex);
    }
  }, [reviews.length, startIndex]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

 
  const currentPage = ((currentIndex - startIndex) % originalLength + originalLength) % originalLength;
  const actualPageNumber = Math.floor(currentPage / itemsPerPage) + 1;

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <SectionHeader 
          badge="  آراء عملائنا"
          title= "قصص نجاح"
          highlightText=" حقيقية"
          description="ما قاله عملاؤنا عن تجربتهم معنا"
        />
        
        <div className={styles.testimonialSliderContainer}>
          <button 
            className={styles.testimonialSliderBtn} 
            onClick={prevSlide}
            aria-label="السابق"
            disabled={isTransitioning}
          >
            <ChevronRight size={24} />
          </button>
          
          <div className={styles.testimonialSlider}>
            <div 
              className={styles.testimonialsGrid}
              style={{
                transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
              }}
            >
              {visibleReviews.map((review, idx) => (
                <div key={`${review.id}-${currentIndex}-${idx}`} className={styles.testimonialCard}>
                  {/* Rating Badge */}
                  <div className={styles.ratingBadge}>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (review.service || 5) ? styles.starFilled : styles.starEmpty}>★</span>
                      ))}
                    </div>
                    <span className={styles.ratingValue}>{review.service || 5}.0</span>
                  </div>
                  
                  {/* Screenshot Image */}
                  <div className={styles.screenshotImage}>
                    <img 
                      src={review.image} 
                      alt={`تقييم العميل`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x800?text=صورة+التقييم';
                      }}
                    />
                  </div>
                  
                  {/* Review Number - الرقم الحقيقي من المصفوفة الأصلية */}
                  <div className={styles.reviewNumber}>
                    تقييم {((currentIndex - startIndex + idx) % originalLength) + 1} من {originalLength}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.testimonialSliderBtn} 
            onClick={nextSlide}
            aria-label="التالي"
            disabled={isTransitioning}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        {/* Slider Dots */}
        <div className={styles.sliderDots}>
          {Array.from({ length: Math.ceil(originalLength / itemsPerPage) }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              className={`${styles.dot} ${pageIndex + 1 === actualPageNumber ? styles.active : ''}`}
              onClick={() => {
                if (isTransitioning) return;
                const targetIndex = startIndex + (pageIndex * itemsPerPage);
                setCurrentIndex(targetIndex);
              }}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
        
        {/* Counter */}
        <div className={styles.counter}>
          صفحة {actualPageNumber} من {Math.ceil(originalLength / itemsPerPage)} | 
          إجمالي {originalLength} تقييم
        </div>
        
        {/* Auto-play indicator */}
        <div className={styles.autoPlayIndicator}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span className={styles.autoPlayText}>تغيير تلقائي كل 3 ثواني</span>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;