import React from 'react';
import styles from './DoctorsSection.module.css';

const DoctorsSection = ({ doctorsData }) => {
  if (doctorsData.length === 0) return null;

  return (
    <section className={styles.doctorsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>أطباؤنا</span>
          <h2>نخبة <span className={styles.gold}>الأطباء الخبراء</span></h2>
          <p>فريق طبي متميز يمتلك خبرات عالمية</p>
        </div>
        
        <div className={styles.doctorsGrid}>
          {doctorsData.map((item) => (
            <div key={item.doctor.id} className={styles.doctorCard}>
              <img src={item.doctor.image} alt={item.doctor.name} />
              <h3>{item.doctor.name}</h3>
              <p>{item.doctor.title}</p>
              <span className={styles.doctorExperience}>{item.doctor.experience} سنة خبرة</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;