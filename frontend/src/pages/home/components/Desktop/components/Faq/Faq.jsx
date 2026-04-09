import React, { useState } from 'react';
import styles from './Faq.module.css';

const FaqDesktop = ({ data }) => {
  // تعيين أول سؤال مفتوح افتراضياً
  const [openFaq, setOpenFaq] = useState(0);

  // عرض Loading إذا كانت البيانات لم تُحمّل بعد
  if (!data || !data.faqs) {
    return (
      <section id="faq" className={styles.faq}>
        <div className={styles.container}>
          <p>جاري التحميل...</p>
        </div>
      </section>
    );
  }

  const faqs = data.faqs;

  // إذا لم يوجد أسئلة
  if (faqs.length === 0) {
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
          <p style={{ textAlign: 'center', color: '#a0a0a0' }}>لا توجد أسئلة حالياً</p>
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
          {faqs.map((faq, idx) => (
            <div
              key={faq.id || idx}
              className={`${styles.item} ${openFaq === idx ? styles.open : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <div className={styles.icon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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

export default FaqDesktop;