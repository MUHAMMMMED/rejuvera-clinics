import React, { useEffect, useState } from 'react';
import Map from '../../../../components/Map/Map';
import WhatsAppFloat from '../../../../components/WhatsAppFloat/WhatsAppFloat';
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
        <WhatsAppFloat phone={data?.info?.phone} whatsapp={data?.info?.whatsapp} />

      </div>
 
   
      
     
    
    </div>
  );
};

export default HomeMobile;