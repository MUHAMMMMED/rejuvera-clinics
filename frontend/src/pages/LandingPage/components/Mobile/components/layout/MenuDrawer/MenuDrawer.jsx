import {
  Camera,
  Clipboard,
  HelpCircle,
  Home,
  Info,
  MessageCircle,
  Star,
  UserRound,
  X
} from 'lucide-react';

import React from 'react';
import styles from './MenuDrawer.module.css';

const menuItems = [
  { id: 'hero', icon: <Home size={18} />, label: 'الرئيسية' },
  { id: 'about', icon: <Info size={18} />, label: 'عن الخدمة' },
  { id: 'benefits', icon: <Star size={18} />, label: 'المميزات' },
  { id: 'results', icon: <Camera size={18} />, label: 'النتائج' },
  { id: 'process', icon: <Clipboard size={18} />, label: 'خطوات الإجراء' },
  { id: 'reviews', icon: <MessageCircle size={18} />, label: 'آراء العملاء' },
  { id: 'doctors', icon: <UserRound size={18} />, label: 'الأطباء' },
  { id: 'faq', icon: <HelpCircle size={18} />, label: 'الأسئلة الشائعة' },
];

const MenuDrawer = ({ isOpen, onClose, onNavigate }) => {
  return (
    <div className={`${styles.menuDrawer} ${isOpen ? styles.open : ''}`}>
      <div className={styles.menuHeader}>
        <img src="https://rejuvera-clinics.vercel.app/images/logo1.png" alt="Logo" />
        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      <div className={styles.menuItems}>
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDrawer;