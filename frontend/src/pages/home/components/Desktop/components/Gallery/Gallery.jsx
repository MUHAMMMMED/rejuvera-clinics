import React, { useState } from 'react';
import styles from './Gallery.module.css';

const GalleryDesktop = ({ data }) => {
  const [lightboxImg, setLightboxImg] = useState(null);

  const openLightbox = (img) => {
    setLightboxImg(img);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImg(null);
    document.body.style.overflow = 'auto';
  };

  if (!data) return <p>Loading...</p>;

  const galleryImages = data?.gallery || [];

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <div className={styles.badge}>
            <span>نتائجنا المتميزة</span>
          </div>

          <h2 className={styles.sectionTitle}>
            معرض <span className={styles.goldText}>النتائج</span>
          </h2>

          <p className={styles.sectionSubtitle}>
            نفخر بمشاركة قصص النجاح والنتائج المبهرة التي حققناها لعملائنا.
          </p>
        </div>

        <div className={styles.grid}>
          {galleryImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className={styles.item}
              onClick={() => openLightbox(img.image)}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={img.image}
                  alt={img.alt_text || `Result ${idx + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />

                <div className={styles.overlay}>
                  <div className={styles.viewBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent}>
            <button className={styles.closeBtn} onClick={closeLightbox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <img src={lightboxImg} alt="preview" />
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryDesktop;