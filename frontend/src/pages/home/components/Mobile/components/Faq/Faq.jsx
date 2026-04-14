import React from 'react';
 
import { GTMEvents } from '../../../../../../hooks/useGTM';
import styles from './Faq.module.css';

const FaqMobile = ({ openFaq, setOpenFaq, data }) => {
  
  // ✅ GTM: تتبع فتح السؤال (مرة واحدة لكل سؤال)
  const [trackedFaqs, setTrackedFaqs] = React.useState({});

  const handleFaqToggle = (index, faqItem) => {
    const isOpening = openFaq !== index;
    const newOpenState = isOpening ? index : null;
    
    setOpenFaq(newOpenState);
    
    // ✅ إرسال حدث GTM عند فتح السؤال (مرة واحدة لكل سؤال)
    if (isOpening && !trackedFaqs[index]) {
      GTMEvents.viewContent(
        `faq_${index}`,
        faqItem.question || `سؤال ${index + 1}`,
        'faq_open'
      );
      setTrackedFaqs(prev => ({ ...prev, [index]: true }));
    }
  };

  // استخدام البيانات من props أو البيانات الافتراضية
  const faqsList = data?.faqs || [];

  // إذا لم توجد أسئلة
  if (faqsList.length === 0) {
    return (
      <section id="faq" className={styles.faq}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>الدعم والمساعدة</span>
            <h2 className={styles.sectionTitle}>
              الأسئلة <span className={styles.goldText}>الشائعة</span>
            </h2>
            <div className={styles.divider} />
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>
            <p>سيتم إضافة الأسئلة الشائعة قريباً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>الدعم والمساعدة</span>
          <h2 className={styles.sectionTitle}>
            الأسئلة <span className={styles.goldText}>الشائعة</span>
          </h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.list}>
          {faqsList.map((faq, idx) => (
            <div 
              key={idx} 
              className={`${styles.item} ${openFaq === idx ? styles.open : ''}`}
            >
              <button 
                className={styles.question} 
                onClick={() => handleFaqToggle(idx, faq)}
              >
                <span>{faq.question}</span>
                <div className={styles.icon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              <div className={styles.answer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqMobile;