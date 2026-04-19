import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import { GTMEvents } from '../../../hooks/useGTM';
import BookingModal from '../../home/components/Mobile/components/BookingModal/BookingModal';
import { createServiceSlug } from '../../LandingPage/components/utils/slugify';
import styles from './Services.module.css';

const ServicesMobile = ({ data }) => {
  const navigate = useNavigate();
  
  // البيانات هي مصفوفة خدمات مباشرة
  const services = Array.isArray(data) ? data : [];
  
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });

  // ✅ تتبع اللمس للخدمات (مرة واحدة لكل خدمة) - للموبايل
  const [touchTracked, setTouchTracked] = useState({});

  // أيقونة ثابتة للخدمات
  const getServiceIcon = () => {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    );
  };

  // ============================================
  // ✅ GTM: فتح نافذة الحجز (openBooking)
  // ============================================
  const handleBookNow = (service) => {
    GTMEvents.openBooking(service.id, service.name, 's');
    
    setBookingModal({
      isOpen: true,
      id: service.id,
      type: 's',
      name: service.name
    });
  };

  // ============================================
  // ✅ GTM: نجاح الحجز (bookingSuccess)
  // ============================================
  const handleBookingSuccess = () => {
    if (bookingModal.id && bookingModal.name) {
      GTMEvents.bookingSuccess(bookingModal.id, bookingModal.name, 's');
    }
 
  };

  // ============================================
  // ✅ GTM: عرض تفاصيل الخدمة (viewContent)
  // ============================================
  const handleServiceDetails = (service) => {
    GTMEvents.viewContent(service.id, service.name);
    
    const slug = createServiceSlug(service.id, service.name, false);
    navigate(`/service/${service.id}/${slug}`);
  };

  // ============================================
  // ✅ GTM: لمس الخدمة (touch - للموبايل)
  // ============================================
  const handleCardTouch = (service) => {
    if (!touchTracked[service.id]) {
      GTMEvents.viewContent(service.id, service.name, 'touch');
      setTouchTracked(prev => ({ ...prev, [service.id]: true }));
    }
  };

  // إذا لم توجد خدمات
  if (services.length === 0) {
    return (
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>خدماتنا المتميزة</span>
            <h2 className={styles.sectionTitle}>
              اختر <span className={styles.goldText}>خدمتك المثالية</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', color: '#a0a0a0' }}>
            <p>لا توجد خدمات متاحة حالياً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>خدماتنا المتميزة</span>
          <h2 className={styles.sectionTitle}>
            اختر <span className={styles.goldText}>خدمتك المثالية</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            اكتشفي خدماتنا المتخصصة واستشيري نخبة من الخبراء
          </p>
        </div>

        {/* Vertical List of Services */}
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={styles.serviceItem}
              style={{ animationDelay: `${index * 0.05}s` }}
              onTouchStart={() => handleCardTouch(service)} // ✅ تتبع اللمس للموبايل
            >
              {/* شارة الخدمة المميزة لأول خدمة */}
              {index === 0 && (
                <div className={styles.popularBadge}>
                  <span>⭐ الأكثر طلباً</span>
                </div>
              )}
              
              <div className={styles.serviceCard}>
                {/* Header Row - Icon on right, Title on left */}
                <div className={styles.headerRow}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon}>
                      {getServiceIcon()}
                    </div>
                  </div>
                  <h3 className={styles.name}>{service.name}</h3>
                </div>
                
                {/* Description */}
                <p className={styles.description}>
                  {service.description}
                </p>
                
                {/* Details */}
                {/* <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>استشارة مجانية</span>
                  </div>
                </div> */}
                
                {/* Buttons */}
                <div className={styles.buttonsGroup}>
                  {/* ✅ زر احجزي الآن -> openBooking */}
                  <button 
                    className={styles.bookBtn}
                    onClick={() => handleBookNow(service)}
                  >
                    <span>احجزي الآن</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* ✅ زر تفاصيل الخدمة -> viewContent */}
                  <button 
                    className={styles.moreBtn}  
                    onClick={() => handleServiceDetails(service)}
                  >
                    <span>تفاصيل الخدمة</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal - Mobile Bottom Sheet */}
      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, id: null, type: 's', name: '' })}
        itemId={bookingModal.id}
        itemType={bookingModal.type}
        itemName={bookingModal.name}
        onSuccess={handleBookingSuccess}
      />
    </section>
  );
};

export default ServicesMobile;