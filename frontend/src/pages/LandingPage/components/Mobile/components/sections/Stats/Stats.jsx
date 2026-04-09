import { Award, CheckCircle2, ThumbsUp, User } from 'lucide-react';
import React from 'react';
import styles from './Stats.module.css';

const Stats = ({ data }) => {
  if (!data) return null;

  const stats = [
    { number: data.experience_years, label: 'سنة خبرة', icon: Award },
    { number: data.success_operations, label: 'عملية ناجحة', icon: CheckCircle2 },
    { number: data.doctors_count, label: 'طبيب متخصص', icon: User },
    { number: data.satisfaction_rate, label: 'نسبة رضا', icon: ThumbsUp }
  ].filter(stat => stat.number);  

  if (stats.length === 0) return null; 

  return (
    <section className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={styles.statCard}>
              <Icon size={20} />
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;