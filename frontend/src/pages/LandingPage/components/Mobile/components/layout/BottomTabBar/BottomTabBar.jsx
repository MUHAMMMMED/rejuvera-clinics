import { Camera, Clipboard, HelpCircle, Home, Star } from 'lucide-react';
import React from 'react';
import styles from './BottomTabBar.module.css';

const tabs = [
  { id: 'hero', icon: <Home size={24} />, label: 'الرئيسية' },
  { id: 'benefits', icon: <Star size={24} />, label: 'المميزات' },
  { id: 'results', icon: <Camera size={24} />, label: 'النتائج' },
  { id: 'process', icon: <Clipboard size={24} />, label: 'الإجراء' },
  { id: 'faq', icon: <HelpCircle size={24} />, label: 'الأسئلة' },
];

const BottomTabBar = ({ onNavigate }) => {
  return (
    <div className={styles.bottomTabBar}>
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onNavigate(tab.id)} 
          title={tab.label}
        >
          <span className={styles.tabIcon}>{tab.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomTabBar;