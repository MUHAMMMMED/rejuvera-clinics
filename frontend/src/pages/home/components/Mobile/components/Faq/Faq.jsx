import React from 'react';
import { faqs } from '../data/clinicData';
import styles from './Faq.module.css';

const FaqMobile = ({ openFaq, setOpenFaq,data }) => {
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
            <div key={idx} className={`${styles.item} ${openFaq === idx ? styles.open : ''}`}>
              <button className={styles.question} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <span>{faq.q}</span>
                <div className={styles.icon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              <div className={styles.answer}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqMobile;