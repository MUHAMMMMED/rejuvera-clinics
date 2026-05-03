import { Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from './FloatingButton.module.css';

const FloatingButton = ({ targetSectionId = 'booking' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTarget, setIsAtTarget] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const targetSection = document.getElementById(targetSectionId);
      
      if (!targetSection) return;
      
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sectionTop = targetSection.offsetTop;
      const sectionBottom = sectionTop + targetSection.offsetHeight;
      
      // Check if we're at the target section
      const atTarget = scrollPosition >= sectionTop && scrollPosition <= sectionBottom;
      setIsAtTarget(atTarget);
      
      // Show button only when not at target and scrolled past 300px
      const shouldShow = window.scrollY > 300 && !atTarget;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSectionId]);

  const scrollToBooking = () => {
    const targetSection = document.getElementById(targetSectionId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <button 
      className={styles.floatingButton}
      onClick={scrollToBooking}
      aria-label="احجز  استشارتك"
    >
      <Calendar size={22} />
      <span>احجز  استشارتك</span>
    </button>
  );
};

export default FloatingButton;