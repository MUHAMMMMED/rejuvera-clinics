import { Calendar } from 'lucide-react';
import React, { useState } from 'react';
import Map from '../../../../components/Map/Map';
import styles from './MobileLanding.module.css';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import BottomTabBar from './components/layout/BottomTabBar/BottomTabBar';
import Header from './components/layout/Header/Header';
import MenuDrawer from './components/layout/MenuDrawer/MenuDrawer';
import BookingModal from './components/modals/BookingModal/BookingModal';
import VideoModal from './components/modals/VideoModal/VideoModal';
import About from './components/sections/About/About';
import BeforeAfter from './components/sections/BeforeAfter/BeforeAfter';
import Benefits from './components/sections/Benefits/Benefits';
import Doctors from './components/sections/Doctors/Doctors';
import FAQ from './components/sections/FAQ/FAQ';
import Hero from './components/sections/Hero/Hero';
import ProcessSteps from './components/sections/ProcessSteps/ProcessSteps';
import Reviews from './components/sections/Reviews/Reviews';
import Stats from './components/sections/Stats/Stats';

const MobileLanding = ({ data }) => {
  const service = data || {};
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [currentBeforeAfter, setCurrentBeforeAfter] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);

  // Extract data from API
  const heroData = service.hero || {};
  const faqsData = service.faqs || [];
  const doctorsData = service.service_doctors || [];
  const trustData = service.trust || {};
  const problemSolution = service.problem_solution || null;
  const beforeAfterData = service.before_after || [];
  const reviewsData = service.reviews || [];
  const process_steps = service.process_steps  || {};
  const feature = service.feature|| null;
  const info = service?.site_info|| null;
  React.useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setLoading(false);
      document.title = heroData.title || service.name || 'خدمة طبية';
    }
  }, [data, heroData.title, service.name]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMenu(false);
  };

  const handleBookingSuccess = () => {
    // Optional: Add any additional logic after successful booking
    // console.log('Booking completed successfully');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.mobileApp}>
      <Header onMenuClick={() => setShowMenu(!showMenu)} />
      
      <MenuDrawer 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)} 
        onNavigate={scrollToSection} 
      />

      <div className={styles.mainContent}>
        <Hero 
          data={heroData} 
          serviceName={service.name}
          onBook={() => setShowBookingModal(true)}
          onPlayVideo={() => setShowVideo(true)}
        />

        <Stats data={trustData} />

        {problemSolution && <About data={problemSolution} />}

        <Benefits feature={feature} />

        {beforeAfterData.length > 0 && (
          <BeforeAfter
            items={beforeAfterData}
            currentIndex={currentBeforeAfter}
            onIndexChange={setCurrentBeforeAfter}
          />
        )}

        <ProcessSteps  process_steps={process_steps} />

        {doctorsData.length > 0 && doctorsData[0].doctor && (
          <Doctors doctor={doctorsData[0].doctor} />
        )}

        {reviewsData.length > 0 && (
          <Reviews 
            items={reviewsData}
            currentIndex={currentReview}
            onIndexChange={setCurrentReview}
          />
        )}

        {faqsData.length > 0 && (
          <FAQ 
            items={faqsData}
            expandedIndex={expandedFaq}
            onToggle={setExpandedFaq}
          />
        )}

     <Map  
      latitude={info.latitude}
      longitude={info?.longitude} 
       address={info.address} 
       working_hours={info?.working_hours} 
       site_name={info?.site_name}
      />
 
        <div className={styles.bottomSpacing} />
      </div>

      <BottomTabBar onNavigate={scrollToSection} />

      <button 
        className={styles.floatingBookBtn} 
        onClick={() => setShowBookingModal(true)}
      >
        <Calendar size={20} />
        <span>احجزي</span>
      </button>

      {showVideo && heroData.video_url && (
        <VideoModal 
          videoUrl={heroData.video_url}
          onClose={() => setShowVideo(false)}
        />
      )}

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        serviceId={service.id}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default MobileLanding;