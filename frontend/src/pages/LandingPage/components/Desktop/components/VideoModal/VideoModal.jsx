import { X } from 'lucide-react';
import React from 'react';
import styles from './VideoModal.module.css';

const VideoModal = ({ videoUrl, onClose, getYouTubeEmbedUrl }) => {
  return (
    <div className={styles.videoModal} onClick={onClose}>
      <div className={styles.fullVideoContainer}>
        <button className={styles.closeFullVideo} onClick={onClose}>
          <X size={32} />
        </button>
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className={styles.fullVideo}
          title="Service Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;