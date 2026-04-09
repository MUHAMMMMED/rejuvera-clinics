import { ArrowLeft, Phone } from 'lucide-react';
import React from 'react';
import styles from './Header.module.css';
import logo from './logo.png';
const Header = () => {
  return (
    <div className={styles.appHeader}>
      <button 
        className={styles.menuBtn} 
        onClick={() => window.history.back()}
      >
          <span className={styles.backText}>عودة</span>
        <ArrowLeft size={22} />
        
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