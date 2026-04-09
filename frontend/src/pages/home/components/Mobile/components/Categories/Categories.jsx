import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';
const CategoriesMobile = ({ setSelectedService, scrollToSection, data }) => {
  const navigate = useNavigate();
  const categories = data?.categories || [];

  // أيقونة افتراضية
  const DefaultServiceIcon = () => (
    <svg 
      width="22" 
      height="22" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.7" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9.5" r="3.5" />
      <path d="M8 15.5 C8 17.5 9.5 19 12 19 C14.5 19 16 17.5 16 15.5" />
      <path d="M7 6 L9 4" />
      <path d="M17 6 L15 4" />
      <path d="M12 3 L12 5" />
      <circle cx="12" cy="9.5" r="1" fill="#d4af37" />
    </svg>
  );

  // دالة لتقصير النص بعدد كلمات
  const truncateWords = (text, maxWords) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/); // أفضل تقسيم للكلمات
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // لو مفيش بيانات
  if (categories.length === 0) {
    return (
      <section id="categories" className={styles.categories}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>الأقسام المتخصصة</span>
            <h2 className={styles.sectionTitle}>
              أقسام <span className={styles.goldText}>خدمات التجميل الطبية</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', color: '#a0a0a0' }}>
            <p>سيتم إضافة الأقسام قريباً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>الأقسام المتخصصة</span>
          <h2 className={styles.sectionTitle}>
            أقسام <span className={styles.goldText}>خدمات التجميل الطبية</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            نقدم أحدث التقنيات الطبية التجميلية بأعلى معايير الجودة والسلامة
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={styles.card}
              style={{ animationDelay: `${index * 90}ms` }}
              onClick={() => {
                setSelectedService(category.name);
                scrollToSection('services');
              }}
            >
              <div className={styles.cardContent}>
                
                {/* الجزء الأيمن */}
                <div className={styles.rightContent}>
                  <div className={styles.icon}>
                    <DefaultServiceIcon />
                  </div>

                  <div className={styles.textWrapper}>
                    <h3 className={styles.name}>{category.name}</h3>

                    <p className={styles.description}>
                      {truncateWords(category.description, 5)}
                    </p>
                  </div>
                </div>
                
                {/* الجزء الأيسر */}
                <div className={styles.leftContent}>
                  <button 
                    className={styles.exploreBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      navigate(`/category/${category?.id}`);  
                    }}
                  >
                    الخدمات
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesMobile;