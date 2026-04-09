import { MessageCircle } from 'lucide-react';
import React from 'react';
import styles from './FaqSection.module.css';

const FaqSection = ({ faqsData, serviceName }) => {
  if (faqsData.length === 0) return null;

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>أسئلة شائعة</span>
          <h2>كل ما تريدين <span className={styles.gold}>معرفته</span></h2>
          <p>أجوبة على الأسئلة الأكثر شيوعاً حول {serviceName}</p>
        </div>
        
        <div className={styles.faqGrid}>
          {faqsData.map((item, i) => (
            <div key={i} className={styles.faqCard}>
              <div className={styles.faqQuestion}>
                <MessageCircle size={20} />
                <h3>{item.question}</h3>
              </div>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;