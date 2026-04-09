import React from 'react';
import styles from './Lightbox.module.css';

const Lightbox = ({ selectedImage, closeLightbox }) => {
  if (!selectedImage) return null;

  return (
    <div className={styles.lightbox} onClick={closeLightbox}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={closeLightbox}>×</button>
        <img src={selectedImage} alt="Full size" />
      </div>
    </div>
  );
};

export default Lightbox;