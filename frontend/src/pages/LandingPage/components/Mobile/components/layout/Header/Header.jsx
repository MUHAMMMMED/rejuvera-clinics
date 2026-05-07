import { ArrowLeft, Phone } from 'lucide-react';
import React from 'react';
import styles from './Header.module.css';
import logo from './logo.png';
const Header = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className={styles.appHeader}>
  {/* Back Button */}
  <button 
          onClick={handleBack}
          className={styles.backButton}
          aria-label="عودة"
        >
          <ArrowLeft size={24} />
          <span>عودة</span>
        </button>
      <img 
        src={logo} 
        alt="Logo-rejuveraclinics" 
        className={styles.logo} 
      />
      <button 
        className={styles.phoneBtn} 
        onClick={() => window.location.href = 'tel:+966114999959'}
      >
        <Phone size={20} />
      </button>
    </div>
  );
};

export default Header;