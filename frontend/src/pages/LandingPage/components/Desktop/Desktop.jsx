import React, { useEffect, useState } from 'react';
import Map from '../../../../components/Map/Map';
import BeforeAfterSection from './components/BeforeAfterSection/BeforeAfterSection';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import DoctorsSection from './components/DoctorsSection/DoctorsSection';
import FaqSection from './components/FaqSection/FaqSection';
import FinalCtaSection from './components/FinalCtaSection/FinalCtaSection';
import HeroSection from './components/HeroSection/HeroSection';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Navbar from './components/Navbar/Navbar';
import ProblemSolution from './components/problemSolution/problemSolution';
import ProcessSteps from './components/ProcessSteps/ProcessSteps';
import TestimonialsSlider from './components/TestimonialsSlider/TestimonialsSlider';
import TrustSection from './components/TrustSection/TrustSection';
import styles from './DesktopLanding.module.css';

const DesktopLanding = ({ data }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setService(data);
      setLoading(false);
      document.title = data.meta?.title || data.name;
    }
  }, [data]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };


  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // مراقبة التمرير لتغيير مظهر الـ Navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (!service) {
    return (
      <div className={styles.errorContainer}>
        <p>عذراً، لم يتم العثور على الخدمة المطلوبة</p>
      </div>
    );
  }

 
  const heroData = service.hero || {};
  const faqsData = service.faqs || [];
  const doctorsData = service.service_doctors || [];
  const trust = service.trust|| null;
  const problem_solution = service.problem_solution || null;
  const before_after= service.before_after|| [];
  const reviews = service.reviews || [];
  const process_steps = service.process_steps  || {};
  const  feature = service.feature|| null;
  const info = service?.site_info|| null;
  return (
    <div className={styles.servicePage}>
       <Navbar 
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isHomePage={false}   
      />
      <HeroSection 
        heroData={heroData} 
        serviceName={service.name} 
        scrollToBooking={scrollToBooking} 
      />
      <TrustSection trust={trust} />
      <ProblemSolution problem_solution={problem_solution}/>
      <BenefitsSection feature={feature} />
      <BeforeAfterSection before_after={before_after}  />
      <ProcessSteps process_steps={process_steps }/>    
      <TestimonialsSlider reviews={reviews}/>
      <DoctorsSection doctorsData={doctorsData} />
      <FaqSection faqsData={faqsData} serviceName={service.name} />
      <FinalCtaSection data={data}/>
      <Map  
      latitude={info.latitude}
      longitude={info?.longitude} 
       address={info.address} 
       working_hours={info?.working_hours} 
       site_name={info?.site_name}
      />
    </div>
  );
};

export default DesktopLanding;