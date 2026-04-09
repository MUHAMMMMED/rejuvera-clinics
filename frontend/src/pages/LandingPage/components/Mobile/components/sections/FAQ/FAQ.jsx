import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import React from 'react';
import styles from './FAQ.module.css';

const FAQ = ({ items, expandedIndex, onToggle }) => {
  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionBadge}>أسئلة شائعة</span>
      </div>
      <div className={styles.faqList}>
        {items.map((item, i) => (
          <div key={item.id || i} className={styles.faqItem}>
            <button 
              className={styles.faqQuestion}
              onClick={() => onToggle(expandedIndex === i ? null : i)}
            >
              <HelpCircle size={16} />
              <span>{item.question}</span>
              {expandedIndex === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expandedIndex === i && (
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;