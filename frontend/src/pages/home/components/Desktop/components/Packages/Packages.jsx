import React, { useState } from 'react';
 
import { GTMEvents } from '../../../../../../hooks/useGTM';
import BookingModal from '../BookingModal/BookingModal';
import styles from './Packages.module.css';

const PackagesDesktop = ({ data, scrollToSection }) => {
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 'p', 
    name: '' 
  });

  // ✅ تتبع hover للباقات (مرة واحدة لكل باقة)
  const [hoverTracked, setHoverTracked] = useState({});

  const packages = data?.packages || [];
  const displayedPackages = showAllPackages ? packages : packages.slice(0, 4);

  // ============================================
  // ✅ الحدث الأول: openBooking (نية حجز باقة)
  // ============================================
  const handleBookNow = (pkg) => {
    GTMEvents.openBooking(pkg.id, pkg.name, 'p');
    
    setBookingModal({
      isOpen: true,
      id: pkg.id,
      type: 'p',
      name: pkg.name
    });
  };

  // ============================================
  // ✅ حدث نجاح الحجز
  // ============================================
  const handleBookingSuccess = () => {
    if (bookingModal.id && bookingModal.name) {
      GTMEvents.bookingSuccess(bookingModal.id, bookingModal.name, 'p');
    }
    console.log('تم حجز الباقة بنجاح');
  };

  // ============================================
  // ✅ حدث hover على الباقة (اختياري)
  // ============================================
  const handleCardHover = (pkg) => {
    if (!hoverTracked[pkg.id]) {
      GTMEvents.viewContent(pkg.id, pkg.name, 'hover');
      setHoverTracked(prev => ({ ...prev, [pkg.id]: true }));
    }
  };

  // ============================================
  // ✅ حدث عرض/إخفاء جميع الباقات
  // ============================================
  const handleTogglePackages = () => {
    const newShowState = !showAllPackages;
    setShowAllPackages(newShowState);
    
    // ✅ تتبع عرض جميع الباقات
    GTMEvents.viewContent(
      newShowState ? 'all_packages' : 'less_packages',
      newShowState ? 'عرض جميع الباقات' : 'عرض أقل',
      'toggle_packages'
    );
  };

  // إذا لم توجد باقات
  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <section id="packages" className={styles.packages}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>باقاتنا الحصرية</span>
          <h2 className={styles.sectionTitle}>
            باقات <span className={styles.goldText}>التميز والرفاهية</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            اختر الباقة المناسبة لاحتياجاتك واستمتع بتجربة تجميلية متكاملة
          </p>
        </div>

        <div className={styles.packagesList}>
          {displayedPackages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => handleCardHover(pkg)}
            >
              {pkg.popular && <div className={styles.popularBadge}>⭐ الأكثر طلباً</div>}

              <div className={styles.cardContent}>
                {/* الجزء الأيمن: الأيقونة والمعلومات الأساسية */}
                <div className={styles.rightSection}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon}>★</div>
                  </div>
                  <div className={styles.infoWrapper}>
                    <h3 className={styles.name}>{pkg.name}</h3>
                    <div className={styles.price}>{pkg.price} جنيه</div>
                  </div>
                </div>

                {/* الجزء الأوسط: الميزات */}
                <div className={styles.middleSection}>
                  <ul className={styles.features}>
                    {(pkg.features || []).slice(0, 3).map((featureObj, idx) => (
                      <li key={featureObj.id || idx}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {featureObj.feature}
                      </li>
                    ))}
                  </ul>
                  {pkg.features?.length > 3 && (
                    <div className={styles.moreFeatures}>
                      +{pkg.features.length - 3} ميزات إضافية
                    </div>
                  )}
                </div>

                {/* الجزء الأيسر: زر الحجز */}
                <div className={styles.leftSection}>
                  {/* ✅ زر احجزي الآن -> openBooking */}
                  <button
                    className={styles.bookBtn}
                    onClick={() => handleBookNow(pkg)}
                  >
                    <span>احجزي الآن</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {packages.length > 4 && (
          <div className={styles.showMore}>
            <button
              className={styles.showMoreBtn}
              onClick={handleTogglePackages}
            >
              {showAllPackages ? 'عرض أقل' : 'عرض جميع الباقات'}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d={showAllPackages ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, id: null, type: 'p', name: '' })}
        itemId={bookingModal.id}
        itemType={bookingModal.type}
        itemName={bookingModal.name}
        onSuccess={handleBookingSuccess}
      />
    </section>
  );
};

export default PackagesDesktop;