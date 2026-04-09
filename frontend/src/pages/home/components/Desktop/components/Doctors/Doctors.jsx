import React from 'react';
import styles from './Doctors.module.css';

const DoctorsDesktop = ({ data }) => {
  // استخراج الأطباء من البيانات المستلمة
  const doctors = data?.doctors|| [];

  return (
    <section id="doctors" className={styles.doctors}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>فريقنا الطبي</span>
          <h2 className={styles.sectionTitle}>
            نخبة <span className={styles.goldText}>الأطباء الخبراء</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            فريق طبي متميز يمتلك خبرات عالمية، يقدم لك أحدث ما توصل إليه العلم في عالم التجميل.
          </p>
        </div>

        <div className={styles.grid}>
          {doctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className={styles.card}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* الجزء العلوي: الصورة */}
              <div className={styles.imageWrapper}>
                <div className={styles.imageFrame}>
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/fallback-image.jpg' 
                    }}
                  />
                </div>
                <div className={styles.imageGlow} />
                
                {/* شارة الخبرة */}
                <div className={styles.experienceBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{doctor.experience || '+10'} سنة خبرة</span>
                </div>
              </div>
              
              {/* الجزء السفلي: المعلومات */}
              <div className={styles.info}>
                <h3 className={styles.name}>{doctor.name}</h3>
                <p className={styles.title}>{doctor.title}</p>
                
                {/* التخصصات - إذا كانت متوفرة في الـ API */}
                {doctor.specialties && doctor.specialties.length > 0 && (
                  <div className={styles.specialties}>
                    {doctor.specialties.slice(0, 3).map((spec, idx) => (
                      <span key={idx} className={styles.specialty}>{spec}</span>
                    ))}
                  </div>
                )}
                
                {/* أزرار التواصل */}
                <div className={styles.actions}>
                  {doctor.instagram && (
                    <a
                      href={`https://instagram.com/${doctor.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.instagramBtn}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span>@{doctor.instagram.replace('@', '')}</span>
                    </a>
                  )}
                  {/* <button 
                    className={styles.consultBtn}
                    onClick={() => {
                      // يمكن إضافة وظيفة الحجز هنا
                      console.log(`طلب استشارة مع الدكتور ${doctor.name}`);
                    }}
                  >
                    استشارة
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsDesktop;