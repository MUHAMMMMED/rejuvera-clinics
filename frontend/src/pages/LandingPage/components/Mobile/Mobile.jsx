import { Calendar } from 'lucide-react';
import React, { useState } from 'react';
import Map from '../../../../components/Map/Map';
import { GTMEvents } from '../../../../hooks/useGTM';
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

  // ✅ تتبع الفيديوهات التي تم مشاهدتها
  const [videoTracked, setVideoTracked] = useState(false);
  // ✅ تتبع الأسئلة الشائعة المفتوحة
  const [faqTracked, setFaqTracked] = useState({});

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

  // ✅ GTM: Page View عند تحميل الصفحة
  React.useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setLoading(false);
      document.title = heroData.title || service.name || 'خدمة طبية';
      
      // ✅ GTM: صفحة الخدمة
      GTMEvents.pageView(`service_${service.id || 'unknown'}`);
      
      // ✅ GTM: عرض الخدمة (viewContent)
      GTMEvents.viewContent(service.id, service.name);
    }
  }, [data, heroData.title, service.name, service.id]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setShowMenu(false);
    
    // ✅ GTM: التنقل إلى قسم معين
    if (id) {
      GTMEvents.viewContent(id, `قسم ${id}`, 'navigation');
    }
  };

  // ============================================
  // ✅ GTM: فتح نافذة الحجز (openBooking)
  // ============================================
  const handleOpenBooking = () => {
    GTMEvents.openBooking(service.id, service.name, 's');
    setShowBookingModal(true);
  };

  // ============================================
  // ✅ GTM: نجاح الحجز (bookingSuccess)
  // ============================================
  const handleBookingSuccess = () => {
    GTMEvents.bookingSuccess(service.id, service.name, 's');
 
  };

  // ============================================
  // ✅ GTM: فتح الفيديو (viewContent)
  // ============================================
  const handleOpenVideo = () => {
    setShowVideo(true);
    
    if (!videoTracked && heroData.video_url) {
      GTMEvents.viewContent(service.id, `${service.name} - فيديو`, 'video_play');
      setVideoTracked(true);
    }
  };

  // ============================================
  // ✅ GTM: فتح الأسئلة الشائعة
  // ============================================
  const handleFaqToggle = (index, faqItem) => {
    const newExpandedIndex = expandedFaq === index ? null : index;
    setExpandedFaq(newExpandedIndex);
    
    // تتبع فتح السؤال (مرة واحدة لكل سؤال)
    if (newExpandedIndex !== null && !faqTracked[index]) {
      GTMEvents.viewContent(
        `faq_${index}`, 
        faqItem.question || `سؤال ${index + 1}`, 
        'faq_open'
      );
      setFaqTracked(prev => ({ ...prev, [index]: true }));
    }
  };

  // ============================================
  // ✅ GTM: تغيير صورة قبل/بعد
  // ============================================
  const handleBeforeAfterChange = (index, item) => {
    setCurrentBeforeAfter(index);
    GTMEvents.viewContent(
      `before_after_${index}`, 
      item.title || `صورة ${index + 1}`, 
      'gallery_navigation'
    );
  };

  // ============================================
  // ✅ GTM: تغيير التقييم
  // ============================================
  const handleReviewChange = (index, review) => {
    setCurrentReview(index);
    GTMEvents.viewContent(
      `review_${index}`, 
      review.name || `تقييم ${index + 1}`, 
      'review_navigation'
    );
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
          onBook={handleOpenBooking}
          onPlayVideo={handleOpenVideo}
          showButtons ={true}
        />

        <Stats data={trustData} />

        {problemSolution && <About data={problemSolution} />}

        <Benefits feature={feature} />

        {beforeAfterData.length > 0 && (
          <BeforeAfter
            items={beforeAfterData}
            currentIndex={currentBeforeAfter}
            onIndexChange={handleBeforeAfterChange}
          />
        )}

        <ProcessSteps process_steps={process_steps} />

        {doctorsData.length > 0 && doctorsData[0].doctor && (
          <Doctors doctor={doctorsData[0].doctor} />
        )}

        {reviewsData.length > 0 && (
          <Reviews 
            items={reviewsData}
            currentIndex={currentReview}
            onIndexChange={handleReviewChange}
          />
        )}

        {faqsData.length > 0 && (
          <FAQ 
            items={faqsData}
            expandedIndex={expandedFaq}
            onToggle={handleFaqToggle}
          />
        )}

        <Map  
          latitude={info?.latitude}
          longitude={info?.longitude} 
          address={info?.address} 
          working_hours={info?.working_hours} 
          site_name={info?.site_name}
        />
 
        <div className={styles.bottomSpacing} />
      </div>

      <BottomTabBar onNavigate={scrollToSection} />

      {/* ✅ زر الحجز العائم -> openBooking */}
      <button 
        className={styles.floatingBookBtn} 
        onClick={handleOpenBooking}
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