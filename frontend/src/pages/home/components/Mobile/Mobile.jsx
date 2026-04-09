import React, { useEffect, useState } from 'react';
import Map from '../../../../components/Map/Map';
import styles from './HomeMobile.module.css';
import AboutMobile from './components/About/About';
import CategoriesMobile from './components/Categories/Categories';
import Contact from './components/Contact/Contact';
import DoctorsMobile from './components/Doctors/Doctors';
import FaqMobile from './components/Faq/Faq';
import Footer from './components/Footer/Footer';
import GalleryMobile from './components/Gallery/Gallery';
import Hero from './components/Hero/Hero';
import Lightbox from './components/Lightbox/Lightbox';
import Navbar from './components/Navbar/Navbar';
import PackagesMobile from './components/Packages/Packages';
import Services from './components/Services/Services';
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat';

const HomeMobile = ({data,clinicName}) => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('جراحة التجميل');
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'categories', 'services', 'packages', 'gallery', 'doctors', 'faq'];
      const scrollPosition = window.scrollY + 100;
      
      setScrolled(window.scrollY > 50);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const openPhoneSheet = (phone) => {
    setSelectedPhone(phone);
    setShowBottomSheet(true);
  };

  const closeBottomSheet = () => {
    setShowBottomSheet(false);
    setSelectedPhone(null);
  };

  return (
    <div className={styles.mobileApp} dir="rtl">
      <Lightbox selectedImage={selectedImage} closeLightbox={closeLightbox} />
      
      <Navbar
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        setMobileMenuOpen={setMobileMenuOpen}
        data={data}
      />
      
      <div className={styles.mainContent}>
        <Hero scrollToSection={scrollToSection} />
        <CategoriesMobile setSelectedService={setSelectedService} scrollToSection={scrollToSection} data={data}/>
        <AboutMobile data={data} />
        <Services selectedService={selectedService} setSelectedService={setSelectedService} data={data}/>
        <PackagesMobile scrollToSection={scrollToSection}data={data} />
        <GalleryMobile openLightbox={openLightbox}data={data} />
        <DoctorsMobile data={data} />
        <FaqMobile openFaq={openFaq} setOpenFaq={setOpenFaq}data={data} />
        <Contact data={data} />
   
      <Map  
      latitude={data?.info?.latitude}
      longitude={data?.info?.longitude} 
       address={data.info.address} 
       working_hours={data?.info?.working_hours} 
       site_name={data?.info?.site_name}
      />
        <Footer scrollToSection={scrollToSection} setSelectedService={setSelectedService} data={data}/>
        <WhatsAppFloat  data={data}/>
      </div>

      {/* Floating Action Button */}
      <button className={styles.fab} onClick={() => openPhoneSheet('+966114999959')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
        </svg>
      </button>

      {/* Bottom Sheet Modal */}
      <div className={`${styles.bottomSheet} ${showBottomSheet ? styles.open : ''}`} onClick={closeBottomSheet}>
        <div className={styles.bottomSheetContent} onClick={e => e.stopPropagation()}>
          <div className={styles.sheetHandle} />
          <div className={styles.sheetHeader}>
            <h3>اتصل بنا</h3>
            <button onClick={closeBottomSheet}>✕</button>
          </div>
          <div className={styles.sheetBody}>
            <a href={`tel:${selectedPhone}`} className={styles.phoneLink}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
              </svg>
              <span>{selectedPhone}</span>
            </a>
            <a href="https://wa.me/966114999959" className={styles.whatsappLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.89.49 3.66 1.35 5.21L2 22l4.79-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M16.95 13.94c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37-.28.3-1.07 1.05-1.07 2.56s1.1 2.97 1.25 3.17c.15.2 2.16 3.3 5.22 4.63.73.32 1.3.51 1.75.66.74.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.13-.3-.2-.6-.34z" />
              </svg>
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;