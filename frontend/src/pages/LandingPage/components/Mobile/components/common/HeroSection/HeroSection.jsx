import { Calendar, Play } from 'lucide-react';
import React, { useState } from 'react';
import VideoModal from '../VideoModal/VideoModal';
import styles from './HeroSection.module.css';

const HeroSection = ({ heroData, serviceName, scrollToBooking }) => {
  const [showVideo, setShowVideo] = useState(false);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        {/* <img src={heroData.image} alt={heroData.alt_text || serviceName} className={styles.heroBgImage} /> */}
        <div className={styles.heroOverlay} />
      </div>
      <div className={styles.heroContent}>
        {heroData.badge && <span className={styles.heroBadge}>{heroData.badge}</span>}
        <h1 className={styles.heroTitle}>{heroData.title || serviceName}</h1>
        <p className={styles.heroSubtitle}>{heroData.subtitle}</p>
        <p className={styles.heroDescription}>{heroData.description}</p>
        
        <div className={styles.heroButtons}>
          <button onClick={scrollToBooking} className={styles.heroCta}>
            <Calendar size={18} />
            احجزي استشارتك المجانية
          </button>
          {heroData.video_url && (
            <button onClick={() => setShowVideo(true)} className={styles.heroSecondary}>
              <Play size={18} />
              شاهد الفيديو
            </button>
          )}
        </div>
      </div>
      
      {showVideo && heroData.video_url && (
        <VideoModal videoUrl={heroData.video_url} onClose={() => setShowVideo(false)} getYouTubeEmbedUrl={getYouTubeEmbedUrl} />
      )}
    </section>
  );
};

export default HeroSection;