import { Calendar, Play } from 'lucide-react';
import React from 'react';
import styles from './Hero.module.css';

const Hero = ({ data, serviceName, onBook, onPlayVideo }) => {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroCard}>
        {data.badge && (
          <span className={styles.heroBadge}>{data.badge}</span>
        )}
        <h1>{data.title || serviceName}</h1>
        <p className={styles.heroSubtitle}>{data.subtitle}</p>
        {data.description && (
          <p className={styles.heroDescription}>{data.description}</p>
        )}
        
        {(data.video_url || data.image) && (
          <div className={styles.heroMedia}>
            {data.video_url ? (
              <div className={styles.videoContainer} onClick={onPlayVideo}>
                <img 
                  src={data.image || ''} 
                  alt={data.alt_text || 'Service'} 
                  className={styles.videoThumbnail}
                />
                <div className={styles.playButton}>
                  <Play size={32} fill="white" />
                </div>
              </div>
            ) : (
              <img 
                src={data.image} 
                alt={data.alt_text || 'Service'} 
                className={styles.heroImage}
              />
            )}
          </div>
        )}

        <div className={styles.heroButtons}>
          <button onClick={onBook} className={styles.heroCta}>
            <Calendar size={16} />
            {data.cta_text || 'احجزي استشارتك المجانية'}
          </button>
          {/* {data.video_url && (
            <button onClick={onPlayVideo} className={styles.heroSecondary}>
              <Play size={16} />
              شاهد الفيديو
            </button>
          )} */}
        </div>
      </div>
    </section>
  );
};

export default Hero;

 