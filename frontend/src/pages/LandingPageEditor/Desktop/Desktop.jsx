import React, { useEffect, useState } from 'react';
import BeforeAfterSection from './components/BeforeAfterSection/BeforeAfterSection';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import DoctorsSection from './components/DoctorsSection/DoctorsSection';
import FaqSection from './components/FaqSection/FaqSection';
import HeroSection from './components/HeroSection/HeroSection';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
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
  
  return (
    <div className={styles.servicePage}>
      <HeroSection 
        heroData={heroData} 
        serviceName={service.name} 
        scrollToBooking={scrollToBooking} 
      />
      <TrustSection trust={trust} />
      <ProblemSolution problem_solution={problem_solution}/>
      <BenefitsSection feature={feature} />
      <BeforeAfterSection before_after={before_after} serviceId={service?.id} />
      <ProcessSteps process_steps={process_steps}/>    
      <TestimonialsSlider reviews={reviews} serviceId={service?.id} />
      <DoctorsSection doctorsData={doctorsData} serviceId={service?.id}  />
      <FaqSection faqsData={faqsData} serviceName={service.name}  serviceId={service?.id} />
   
    </div>
  );
};

export default DesktopLanding;