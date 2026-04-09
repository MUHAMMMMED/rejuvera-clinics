import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeviceCard.module.css';

const DeviceCard = ({ device, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/device/${device.id}`);
  };

  // تنسيق التاريخ (اختياري)
  const formattedDate = new Date(device.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardGlow} />
      <div className={styles.cardBorder} />

      {/* شارة جديد */}
      {device.is_new && (          // ← هنا is_new (بالـ underscore)
        <div className={styles.newBadge}>
          <span>🔥 جديد</span>
        </div>
      )}

      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img 
            src={device.image}        // ← الحقل اسمه image وليس imageUrl
            alt={device.name} 
            className={styles.deviceImage} 
          />
        </div>

        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{device.name}</h3>
          <p className={styles.summary}>{device.summary}</p>
        </div>
 
        <div className={styles.details}>
          <div className={styles.date}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        <button
          className={styles.detailsBtn}
          onClick={handleViewDetails}
        >
          <span>تفاصيل الجهاز</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className={styles.hoverEffect}>
        <div className={styles.hoverGlow} />
      </div>
    </div>
  );
};

export default DeviceCard;