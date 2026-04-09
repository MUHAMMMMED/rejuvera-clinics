import { Activity, CheckCircle2, ClipboardCheck, Clock } from 'lucide-react';
import React from 'react';
import styles from './Benefits.module.css';

const Benefits = ({ feature }) => {
  if (!feature) return null;

  const steps = [
    {
      title: feature.results_title,
      desc: feature.results_description,
      icon: ClipboardCheck
    },
    {
      title: feature.safety_title,
      desc: feature.safety_description,
      icon: Clock
    },
    {
      title: feature.recovery_title,
      desc: feature.recovery_description,
      icon: Activity
    },
    {
      title: feature.care_title,
      desc: feature.care_description,
      icon: CheckCircle2
    }
  ].filter(item => item.title && item.desc);  

  if (steps.length === 0) return null;

  return (
    <section id="benefits" className={styles.benefitsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>لماذا ريجوفيرا؟</span>
          <h2 className={styles.sectionTitle}>
            مميزات <span className={styles.gold}>{feature.title || 'خدمتنا'}</span>
          </h2>
          {feature.subtitle && (
            <p className={styles.sectionSubtitle}>
              {feature.subtitle}
            </p>
          )}
        </div>

        <div className={styles.benefitsGrid}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <Icon size={24} />
                </div>
                <div className={styles.benefitContent}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;