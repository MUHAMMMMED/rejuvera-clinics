import React from 'react';
 
import { GTMEvents } from '../../../../../../hooks/useGTM';
import styles from './Gallery.module.css';

const GalleryMobile = ({ openLightbox, data, onImageClick }) => {
  // استخراج الصور من البيانات المستلمة
  const galleryImages = data?.gallery || [];

  // ✅ GTM: فتح الصورة في الـ Lightbox
  const handleImageClick = (img, imageData) => {
    // ✅ إرسال حدث GTM عند فتح الصورة
    if (onImageClick) {
      onImageClick(imageData);
    } else {
      GTMEvents.viewContent(
        imageData.id || imageData.alt_text || 'gallery_image',
        imageData.alt_text || 'صورة من المعرض',
        'gallery_image'
      );
    }
    
    // فتح الـ Lightbox
    if (openLightbox) {
      openLightbox(img);
    }
  };

  // إذا لم توجد صور
  if (galleryImages.length === 0) {
    return (
      <section id="gallery" className={styles.gallery}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.badge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </svg>
              <span>نتائجنا المتميزة</span>
            </div>
            <h2 className={styles.sectionTitle}>
              معرض <span className={styles.goldText}>النتائج</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', color: '#a0a0a0' }}>
            <p>سيتم إضافة الصور قريباً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>
            <span>نتائجنا المتميزة</span>
          </div>
          <h2 className={styles.sectionTitle}>
            معرض <span className={styles.goldText}>النتائج</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            نفخر بمشاركة قصص النجاح والنتائج المبهرة التي حققناها لعملائنا، بجودة واحترافية عالية.
          </p>
        </div>

        <div className={styles.grid}>
          {galleryImages.map((img, idx) => (
            <div 
              key={img.id || idx} 
              className={styles.item} 
              onClick={() => handleImageClick(img.image, img)}
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
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryMobile;