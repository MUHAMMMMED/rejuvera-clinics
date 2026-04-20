import React from 'react';
import BeforeAfterSection from '../LandingPage/components/Desktop/components/BeforeAfterSection/BeforeAfterSection';
import BenefitsSection from '../LandingPage/components/Desktop/components/BenefitsSection/BenefitsSection';
import HeroSection from '../LandingPage/components/Desktop/components/HeroSection/HeroSection';

export default function Desktop({ service }) {
  // Extract data from the service prop
  const { 
    trust, 
    feature, 
    before_after = [], 
    process_steps,
    hero,
    name,
    description
  } = service;

  // Define scrollToBooking function if needed
  const scrollToBooking = () => {
    // Find and scroll to booking section
    const bookingElement = document.getElementById('booking-section');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section - pass the hero data from service */}
      <HeroSection 
        heroData={hero}  // Changed from heroData to hero (matches your API response)
        serviceName={name} 
        scrollToBooking={scrollToBooking} 
        showButtons={false}
      />
      {/* Trust Section - only render if trust data exists */}
      {/* {trust && <TrustSection trust={trust} />}
       */}
      {/* Benefits Section */}
      {feature && <BenefitsSection feature={feature} />}
      
      {/* Before/After Section */}
      {before_after && before_after.length > 0 && (
        <BeforeAfterSection before_after={before_after} />
      )}
      
      {/* Process Steps */}
      {/* {process_steps && <ProcessSteps process_steps={process_steps} />} */}
    </>
  )
}