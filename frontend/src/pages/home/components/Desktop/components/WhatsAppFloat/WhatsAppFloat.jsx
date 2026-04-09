import React from 'react';
import styles from './WhatsAppFloat.module.css';

const WhatsAppFloat = () => {
  const whatsappNumber = '966114999959';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أرغب في الاستفسار عن خدماتكم')}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="تواصل عبر واتساب"
    >
      <div className={styles.pulse} />
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.whatsappIcon}
      >
        <path 
          d="M12 2C6.48 2 2 6.48 2 12c0 1.89.49 3.66 1.35 5.21L2 22l4.79-1.35A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" 
          fill="currentColor"
        />
        <path 
          d="M16.95 13.94c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37-.28.3-1.07 1.05-1.07 2.56s1.1 2.97 1.25 3.17c.15.2 2.16 3.3 5.22 4.63.73.32 1.3.51 1.75.66.74.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.13-.3-.2-.6-.34z" 
          fill="white"
        />
      </svg>
      <span className={styles.tooltip}>تواصل معنا عبر واتساب</span>
    </a>
  );
};

export default WhatsAppFloat;