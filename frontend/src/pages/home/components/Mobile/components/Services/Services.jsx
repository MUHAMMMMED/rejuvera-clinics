 
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createServiceSlug } from '../../../../../LandingPage/components/utils/slugify';
import BookingModal from '../BookingModal/BookingModal';
import styles from './Services.module.css';
const Services = ({ selectedService, setSelectedService, data }) => {
  const navigate = useNavigate();
  const categories = data?.categories || [];
  
  // بناء كائن الخدمات من التصنيفات
  const services = {};
  categories.forEach(category => {
    services[category.name] = category.services;
  });
  
  const serviceTabs = ['الكل', ...Object.keys(services)];
  const [activeTab, setActiveTab] = useState('الكل');
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [bookingModal, setBookingModal] = useState({ 
    isOpen: false, 
    id: null, 
    type: 's', 
    name: '' 
  });
  const tabsRef = useRef(null);
  const servicesScrollRef = useRef(null);
  const autoScrollTabsInterval = useRef(null);
  const autoScrollServicesInterval = useRef(null);
  const [showLeftNav, setShowLeftNav] = useState(false);
  const [showRightNav, setShowRightNav] = useState(false);

  // أيقونة ثابتة للخدمات
  const getServiceIcon = () => {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    );
  };

  // Get displayed services based on selected tab
  const getDisplayedServices = () => {
    if (activeTab === 'الكل') {
      return Object.values(services).flat();
    }
    return services[activeTab] || [];
  };

  const handleBookNow = (service) => {
    setBookingModal({
      isOpen: true,
      id: service.id,
      type: 's',
      name: service.name
    });
  };

  const handleBookingSuccess = () => {
    // console.log('تم حجز الخدمة بنجاح');
  };


  const handleServiceDetails = (service) => {
    const slug = createServiceSlug(service.id, service.name, false);
    navigate(`/service/${service.id}/${slug}`);
  };


  const displayedServices = getDisplayedServices();
  const servicesPerGroup = 5; // Changed from 2 to 5 cards per group
  const totalGroups = Math.ceil(displayedServices.length / servicesPerGroup);

  // Check if navigation buttons should be shown
  const checkServiceScroll = () => {
    if (servicesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = servicesScrollRef.current;
      setShowLeftNav(scrollLeft > 10);
      setShowRightNav(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Auto scroll services every 3 seconds
  useEffect(() => {
    if (totalGroups > 1) {
      if (autoScrollServicesInterval.current) clearInterval(autoScrollServicesInterval.current);
      autoScrollServicesInterval.current = setInterval(() => {
        setCurrentScrollIndex((prev) => {
          const nextIndex = (prev + 1) % totalGroups;
          scrollToServicesGroup(nextIndex);
          return nextIndex;
        });
      }, 3000);
    }
    return () => {
      if (autoScrollServicesInterval.current) clearInterval(autoScrollServicesInterval.current);
    };
  }, [totalGroups]);

  // Auto scroll tabs every 20 seconds
  useEffect(() => {
    if (serviceTabs.length > 2) {
      autoScrollTabsInterval.current = setInterval(() => {
        if (tabsRef.current) {
          const currentActiveIndex = serviceTabs.indexOf(activeTab);
          const nextIndex = (currentActiveIndex + 1) % serviceTabs.length;
          const nextTab = serviceTabs[nextIndex];
          setActiveTab(nextTab);
          setSelectedService(nextTab === 'الكل' ? Object.keys(services)[0] : nextTab);
          setCurrentScrollIndex(0);
          
          // Scroll to the selected tab
          const tabElements = tabsRef.current.children;
          if (tabElements[nextIndex]) {
            tabElements[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }, 20000);
    }
    return () => {
      if (autoScrollTabsInterval.current) clearInterval(autoScrollTabsInterval.current);
    };
  }, [serviceTabs.length, activeTab, setSelectedService]);

  // Check scroll on mount and when services change
  useEffect(() => {
    setTimeout(() => {
      checkServiceScroll();
    }, 100);
  }, [displayedServices]);

  const scrollToServicesGroup = (index) => {
    if (servicesScrollRef.current) {
      const scrollAmount = index * servicesScrollRef.current.clientWidth;
      servicesScrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollServices = (direction) => {
    if (servicesScrollRef.current) {
      const scrollAmount = servicesScrollRef.current.clientWidth;
      const newScrollLeft = servicesScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      servicesScrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      // Update current index based on new scroll position
      setTimeout(() => {
        const newIndex = Math.round(servicesScrollRef.current.scrollLeft / servicesScrollRef.current.clientWidth);
        setCurrentScrollIndex(newIndex);
      }, 300);
      
      // Reset auto scroll timer
      if (autoScrollServicesInterval.current) {
        clearInterval(autoScrollServicesInterval.current);
        autoScrollServicesInterval.current = setInterval(() => {
          setCurrentScrollIndex((prev) => {
            const nextIndex = (prev + 1) % totalGroups;
            scrollToServicesGroup(nextIndex);
            return nextIndex;
          });
        }, 3000);
      }
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedService(tab === 'الكل' ? Object.keys(services)[0] : tab);
    setCurrentScrollIndex(0);
    
    // Reset auto scroll timer
    if (autoScrollServicesInterval.current) {
      clearInterval(autoScrollServicesInterval.current);
      autoScrollServicesInterval.current = setInterval(() => {
        setCurrentScrollIndex((prev) => {
          const nextIndex = (prev + 1) % totalGroups;
          scrollToServicesGroup(nextIndex);
          return nextIndex;
        });
      }, 3000);
    }
  };

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAllServices = () => {
    window.location.href = '/services';
  };

  // Create groups of 5 cards (displayed in a grid)
  const serviceGroups = [];
  for (let i = 0; i < displayedServices.length; i += servicesPerGroup) {
    serviceGroups.push(displayedServices.slice(i, i + servicesPerGroup));
  }

  // إذا لم توجد بيانات
  if (!data || categories.length === 0) {
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
            <p>جاري تحميل الخدمات...</p>
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

        {/* Tabs with Auto Scroll */}
        <div className={styles.tabsSection}>
          <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={() => scrollTabs('left')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <div className={styles.tabsWrapper}>
            <div className={styles.tabs} ref={tabsRef}>
              {serviceTabs.map((tab, idx) => (
                <button
                  key={tab}
                  className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => handleTabClick(tab)}
                >
                  <span className={styles.tabIcon}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <button className={`${styles.navBtn} ${styles.navNext}`} onClick={() => scrollTabs('right')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator for Tabs */}
        <div className={styles.scrollIndicator}>
          <div className={styles.indicatorLine}>
            <div className={styles.indicatorProgress} />
          </div>
          <span className={styles.scrollHint}>⇄ اسحب للتنقل بين الأقسام</span>
        </div>

        {/* Services Horizontal Scroll - Groups of 5 cards in grid layout */}
        <div className={styles.servicesScrollSection}>
          {showLeftNav && (
            <button className={`${styles.serviceNavBtn} ${styles.serviceNavLeft}`} onClick={() => scrollServices('left')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          
          <div className={styles.servicesScrollWrapper}>
            <div className={styles.servicesScroll} ref={servicesScrollRef} onScroll={checkServiceScroll}>
              {serviceGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.servicesGroup}>
                  <div className={styles.servicesGrid}>
                    {group.map((service, cardIndex) => (
                      <div 
                        key={service.id} 
                        className={`${styles.card} ${service.popular ? styles.popular : ''}`}
                        style={{ animationDelay: `${cardIndex * 0.05}s` }}
                      >
                        {service.popular && (
                          <div className={styles.popularBadge}>
                            <span>⭐ الأكثر طلباً</span>
                          </div>
                        )}
                        
                        <div className={styles.cardInner}>
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
                          <p className={styles.description}>{service.description}</p>
                          
                          {/* Details */}
                          <div className={styles.details}>
                            {/* <div className={styles.detailItem}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>{service.duration || '٣٠-٦٠ دقيقة'}</span>
                            </div> */}
                            <div className={styles.detailDivider} />
                            <div className={styles.detailItem}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              <span>{service.price || 'استشارة مجانية'}</span>
                            </div>
                          </div>
                          
                          {/* Buttons */}
                          <div className={styles.buttonsGroup}>
                            <button 
                              className={styles.bookBtn}
                              onClick={() => handleBookNow(service)}
                            >
                              <span>احجزي الآن</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                            <button className={styles.moreBtn}  onClick={() => handleServiceDetails(service)}>
                              <span>تفاصيل</span>
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
              ))}
            </div>
          </div>
          
          {showRightNav && (
            <button className={`${styles.serviceNavBtn} ${styles.serviceNavRight}`} onClick={() => scrollServices('right')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Slide Indicators */}
        <div className={styles.slideIndicators}>
          {Array.from({ length: totalGroups }).map((_, idx) => (
            <button
              key={idx}
              className={`${styles.slideDot} ${currentScrollIndex === idx ? styles.active : ''}`}
              onClick={() => {
                setCurrentScrollIndex(idx);
                scrollToServicesGroup(idx);
                if (autoScrollServicesInterval.current) {
                  clearInterval(autoScrollServicesInterval.current);
                  autoScrollServicesInterval.current = setInterval(() => {
                    setCurrentScrollIndex((prev) => {
                      const nextIndex = (prev + 1) % totalGroups;
                      scrollToServicesGroup(nextIndex);
                      return nextIndex;
                    });
                  }, 3000);
                }
              }}
            />
          ))}
        </div>

        {/* View All Services Button */}
        <div className={styles.viewAllContainer}>
          <button className={styles.viewAllBtn} onClick={handleViewAllServices}>
            <span>عرض جميع الخدمات</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
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

export default Services;