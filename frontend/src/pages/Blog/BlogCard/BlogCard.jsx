import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
import { GTMEvents } from '../../../hooks/useGTM';
import styles from './BlogCard.module.css';

const BlogCard = ({ post, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleReadMore = () => {
    // ✅ GTM: تتبع النقر على المقال
    GTMEvents.viewContent(post.id, post.title);
    
    // التنقل إلى صفحة التفاصيل
    navigate(`/blog/${post.id}`);
  };

  // تنسيق التاريخ بشكل آمن
  const formatDate = (dateString) => {
    if (!dateString) return "تاريخ غير متوفر";

    const date = new Date(dateString);
    
    // التحقق إذا كان التاريخ صالح
    if (isNaN(date.getTime())) {
      return "تاريخ غير صالح";
    }

    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedDate = formatDate(post.created_at);

  // أيقونة افتراضية للمقال
  const getBlogIcon = () => {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4zM8 8h8M8 12h6M8 16h4" />
        <path d="M16 4v16" />
      </svg>
    );
  };

  return (
    <div 
      className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardGlow} />
      <div className={styles.cardBorder} />
      
      {/* شارة مميزة لأحدث مقال */}
      {index === 0 && (
        <div className={styles.newBadge}>
          <span>✨ أحدث المقالات</span>
        </div>
      )}
      
      <div className={styles.cardContent}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            {getBlogIcon()}
          </div>
        </div>
        
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{post.title}</h3>
          <p className={styles.summary}>{post.summary}</p>
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
          className={styles.readMoreBtn}
          onClick={handleReadMore}
        >
          <span>اقرأ المقال</span>
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

export default BlogCard;