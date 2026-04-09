import { Award, Instagram } from 'lucide-react';
import React from 'react';
import styles from './Doctors.module.css';

const Doctors = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <section id="doctors" className={styles.doctorsSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionBadge}>الفريق الطبي</span>
      </div>
      <div className={styles.doctorCard}>
        <div className={styles.doctorImage}>
          <img 
            src={doctor.image || '/api/placeholder/150/150'} 
            alt={doctor.name} 
          />
        </div>
        <div className={styles.doctorInfo}>
          <h3>{doctor.name}</h3>
          <p className={styles.doctorTitle}>{doctor.title}</p>
          {doctor.experience && (
            <p className={styles.doctorExperience}>
              <Award size={14} />
              {doctor.experience} سنوات خبرة
            </p>
          )}
          {doctor.instagram && (
            <a 
              href={`https://instagram.com/${doctor.instagram}`} 
              className={styles.doctorSocial}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={16} />
              @{doctor.instagram}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctors;