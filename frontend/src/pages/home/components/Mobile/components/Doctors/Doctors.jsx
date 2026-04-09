import React from 'react';
import styles from './Doctors.module.css';

const DoctorsMobile = ({ data }) => {
  const doctors = data?.doctors || [];
  if (doctors.length === 0) {
    return (
      <section id="doctors" className={styles.doctors}>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionBadge}>فريقنا الطبي</span>
            <h2 className={styles.sectionTitle}>
              نخبة <span className={styles.goldText}>الأطباء الخبراء</span>
            </h2>
          </div>
          <div style={{ textAlign: 'center', padding: '50px', color: '#a0a0a0' }}>
            <p>سيتم إضافة الأطباء قريباً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors" className={styles.doctors}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionBadge}>فريقنا الطبي</span>
          <h2 className={styles.sectionTitle}>
            نخبة <span className={styles.goldText}>الأطباء الخبراء</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            فريق طبي متميز يمتلك خبرات عالمية
          </p>
        </div>

        <div className={styles.doctorsList}>
          {doctors.map((doctor, index) => (
            <div 
              key={doctor.id} 
              className={styles.doctorCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardContent}>
                {/* القسم الأول: الصورة */}
                <div className={styles.imageWrapper}>
                  <div className={styles.imageFrame}>
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Doctor+Image';
                      }}
                    />
                  </div>
                </div>
                
                {/* القسم الثاني: المعلومات */}
                <div className={styles.infoWrapper}>
                  <h3 className={styles.name}>{doctor.name}</h3>
                  <p className={styles.title}>{doctor.title}</p>
                  <div className={styles.experience}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{doctor.experience || ''}</span>
                  </div>
                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <div className={styles.specialties}>
                      {doctor.specialties.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className={styles.specialty}>{spec}</span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* القسم الثالث: الأزرار (عمودية) */}
                <div className={styles.actionsWrapper}>
                  {doctor.instagram && (
                    <a
                      href={`https://instagram.com/${doctor.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.instagramBtn}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
                      console.log(`طلب استشارة مع الدكتور ${doctor.name}`);
                      // يمكن إضافة وظيفة الحجز هنا
                    }}
                  >
                    استشارة مجانية
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

export default DoctorsMobile;