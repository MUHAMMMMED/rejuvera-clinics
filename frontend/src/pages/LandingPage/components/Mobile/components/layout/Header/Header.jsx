 
import { ArrowLeft, Phone } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from './logo.png';

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1 && document.referrer) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <header className={styles.appHeader}>
      <button 
        onClick={handleBack} 
        className={styles.backBtn}  {/* 👈 استخدام الـ class الجديد */}
        aria-label="عودة للخلف"
      >
        <ArrowLeft size={20} />
        <span className={styles.backText}>عودة</span>
      </button>

      <img src={logo} alt="شعار الموقع" className={styles.logo} />

      <button 
        className={styles.phoneBtn}
        onClick={() => window.location.href = 'tel:+966114999959'}
        aria-label="اتصال هاتفي"
      >
        <Phone size={20} />
      </button>
    </header>
  );
};

export default Header;