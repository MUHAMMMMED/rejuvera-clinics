import { Award, CheckCircle2, ThumbsUp, Users } from 'lucide-react';
import React from 'react';
import styles from './TrustSection.module.css';

const TrustSection = ({ trust }) => {
  if (!trust) return null; // لو البيانات مش موجودة

  const stats = [
    { number: trust.experience_years, label: 'سنة خبرة', icon: Award },
    { number: trust.success_operations, label: 'عملية ناجحة', icon: CheckCircle2 },
    { number: trust.doctors_count, label: 'طبيب استشاري', icon: Users },
    { number: trust.satisfaction_rate, label: 'رضا العملاء', icon: ThumbsUp }
  ];

  return (
    <section className={styles.trustSection}>
      <div className={styles.container}>
        <div className={styles.trustGrid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={styles.trustCard}>
                <Icon size={32} />
                <span className={styles.trustNumber}>{stat.number}</span>
                <span className={styles.trustLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;