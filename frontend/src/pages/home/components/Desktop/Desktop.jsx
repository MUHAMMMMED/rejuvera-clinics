import React, { useEffect, useState } from 'react';
import Map from '../../../../components/Map/Map';
import Navbar from '../../../../components/Navbar/Navbar';
  
import WhatsAppFloat from '../../../../components/WhatsAppFloat/WhatsAppFloat';
import './HomeDesktop.css';
import AboutDesktop from './components/About/About';
import CategoriesDesktop from './components/Categories/Categories';
import Contact from './components/Contact/Contact';
import DoctorsDesktop from './components/Doctors/Doctors';
import FaqDesktop from './components/Faq/Faq';
import Footer from './components/Footer/Footer';
import GalleryDesktop from './components/Gallery/Gallery';
import Hero from './components/Hero/Hero';
import Lightbox from './components/Lightbox/Lightbox';
import PackagesDesktop from './components/Packages/Packages';
import Services from './components/Services/Services';
 
const HomeDesktop = ({data, clinicName}) => {
 
  // ✅ استخدام state ديناميكي يعتمد على البيانات
  const [selectedService, setSelectedService] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ استخراج أول تصنيف كقيمة افتراضية عند تحميل البيانات
  useEffect(() => {
    if (data?.categories && data.categories.length > 0 && !selectedService) {
      setSelectedService(data.categories[0].name);
    }
  }, [data, selectedService]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="desktop-clinic-container" dir="rtl">
      <Lightbox selectedImage={selectedImage} closeLightbox={closeLightbox} />
      <Navbar/>
      <Hero scrollToSection={scrollToSection} />
      <CategoriesDesktop data={data} setSelectedService={setSelectedService} scrollToSection={scrollToSection} />
      <AboutDesktop data={data}/>
      <Services data={data} selectedService={selectedService} setSelectedService={setSelectedService} />
      <PackagesDesktop data={data} scrollToSection={scrollToSection} />
      <GalleryDesktop data={data} openLightbox={openLightbox} />
      <DoctorsDesktop data={data} />
      <FaqDesktop data={data} />  
      <Contact data={data}  />
      <Map  
        latitude={data?.info?.latitude}
        longitude={data?.info?.longitude} 
        address={data.info?.address} 
        working_hours={data?.info?.working_hours} 
        site_name={data?.info?.site_name}
      />
      <Footer data={data} scrollToSection={scrollToSection} setSelectedService={setSelectedService} />
      <WhatsAppFloat phone={data?.info?.phone} whatsapp={data?.info?.whatsapp} />

    </div>
  );
};

export default HomeDesktop;