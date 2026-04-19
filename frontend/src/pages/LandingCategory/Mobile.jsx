import React, { useState } from 'react';
import BeforeAfter from '../LandingPage/components/Mobile/components/sections/BeforeAfter/BeforeAfter';
import Benefits from '../LandingPage/components/Mobile/components/sections/Benefits/Benefits';
import Hero from '../LandingPage/components/Mobile/components/sections/Hero/Hero';

export default function Mobile({ service }) {
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

  // State for before/after carousel
  const [currentBeforeAfter, setCurrentBeforeAfter] = useState(0);

  // Handle booking button click
  const handleOpenBooking = () => {
    const bookingElement = document.getElementById('booking-section');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle video playback
  const handleOpenVideo = () => {
    // Implement video modal logic here
    // For example: setShowVideoModal(true)
    console.log('Open video');
  };

  

  return (
    <>
      {/* Hero Section */}
      {hero && (

<Hero

  data={hero}

  serviceName={name}

  onBook={handleOpenBooking}

  onPlayVideo={handleOpenVideo}

  showButtons={false}

/>

)}
      {/* Trust/Stats Section */}
      {/* {trust && <Stats data={trust} />} */}

      {/* Benefits Section */}
      {feature && <Benefits feature={feature} />}

      {/* Before/After Section */}
      {before_after && before_after.length > 0 && (
        <BeforeAfter
          items={before_after}
          currentIndex={currentBeforeAfter}
          onIndexChange={handleBeforeAfterChange}
        />
      )}

      {/* Process Steps Section */}
      {/* {process_steps && <ProcessSteps process_steps={process_steps} />} */}
    </>
  );
}