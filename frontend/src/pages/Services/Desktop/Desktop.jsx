import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import { GTMEvents } from '../../../hooks/useGTM';
import BookingModal from '../../home/components/Desktop/components/BookingModal/BookingModal';
import { createServiceSlug } from '../../LandingPage/components/utils/slugify';
import styles from './Services.module.css';

const ServicesDesktop = ({ data }) => {  
  const navigate = useNavigate();
  
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });

  // ✅ تتبع hover للخدمات (مرة واحدة لكل خدمة)
  const [hoverTracked, setHoverTracked] = useState({});

  const services = Array.isArray(data) ? data : [];

  // أيقونات مميزة لكل خدمة (اختيارية)
  const getServiceIcon = (serviceName) => {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
  // ✅ GTM: تمرير الماوس على الخدمة (hover)
  // ============================================
  const handleCardHover = (service) => {
    setHoveredCard(service.id);
    
    if (!hoverTracked[service.id]) {
      GTMEvents.viewContent(service.id, service.name, 'hover');
      setHoverTracked(prev => ({ ...prev, [service.id]: true }));
    }
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  // إذا لم توجد خدمات
  if (services.length === 0) {
    return (
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>خدماتنا المتميزة</span>
            <h2 className={styles.sectionTitle}>
              <span className={styles.goldText}>لا توجد خدمات</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              عذراً، لا توجد خدمات متاحة حالياً. يرجى العودة لاحقاً.
            </p>
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

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`${styles.card} ${hoveredCard === service.id ? styles.cardHovered : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => handleCardHover(service)}
              onMouseLeave={handleCardLeave}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardBorder} />
              
              {index === 0 && (
                <div className={styles.popularBadge}>
                  <span>⭐ الأكثر طلباً</span>
                </div>
              )}
              
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <div className={styles.icon}>
                    {getServiceIcon(service.name)}
                  </div>
                </div>
                
                <div className={styles.textWrapper}>
                  <h3 className={styles.name}>{service.name}</h3>
                  <p className={styles.description}>{service.description}</p>
                </div>
                
                {/* <div className={styles.details}>
                  <div className={styles.price}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <span>استشارة مجانية</span>
                  </div>
                </div> */}
                
                {/* ✅ زر احجزي الآن -> openBooking */}
                <button 
                  className={styles.bookBtn}
                  onClick={() => handleBookNow(service)}
                >
                  <span>احجزي الآن</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* ✅ زر تفاصيل الخدمة -> viewContent */}
                <button 
                  className={styles.moreBtn} 
                  onClick={() => handleServiceDetails(service)}
                >
                  <span>تفاصيل الخدمة</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className={styles.hoverEffect}>
                <div className={styles.hoverGlow} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
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

export default ServicesDesktop;