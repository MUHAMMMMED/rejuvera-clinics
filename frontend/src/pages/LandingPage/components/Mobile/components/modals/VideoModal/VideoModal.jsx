import { X } from 'lucide-react';
import React from 'react';
import styles from './VideoModal.module.css';

const VideoModal = ({ videoUrl, onClose }) => {
  // دالة لتحويل أي رابط YouTube إلى رابط embed صحيح
  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      return url; // لو الرابط غير صالح
    }
  };

  // منع click داخل iframe من إغلاق المودال
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.videoModal} onClick={onClose}>
      <div className={styles.fullVideoContainer} onClick={handleContainerClick}>
        <button className={styles.closeFullVideo} onClick={onClose}>
          <X size={24} />
        </button>
        <iframe
          src={getEmbedUrl(videoUrl)}
          title="Service Video"
          className={styles.fullVideo}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;