import * as Icons from 'lucide-react';
import React from 'react';
import styles from './ProcessSteps.module.css';

const ProcessSteps = ({ process_steps }) => {

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon size={32} /> : null;
  };

  const steps = process_steps
    ? [
        {
          step: 1,
          title: process_steps.consultation_title,
          desc: process_steps.consultation_description,
          duration: process_steps.consultation_duration,
          icon: 'Users'
        },
        {
          step: 2,
          title: process_steps.preparation_title,
          desc: process_steps.preparation_description,
          duration: process_steps.preparation_duration,
          icon: 'Shield'
        },
        {
          step: 3,
          title: process_steps.procedure_title,
          desc: process_steps.procedure_description,
          duration: process_steps.procedure_duration,
          icon: 'Sparkles'
        },
        {
          step: 4,
          title: process_steps.followup_title,
          desc: process_steps.followup_description,
          duration: process_steps.followup_duration,
          icon: 'Heart'
        }
      ].filter(step => step.title && step.desc)
    : [];

  if (!steps.length) return null;

  return (
    <section className={styles.processSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>خطوات الإجراء
           </span>
          <h2 className={styles.sectionTitle}>
            رحلة تحولك{' '}
            <span className={styles.gold}>{process_steps?.title || ''}</span>
          </h2>
          <p className={styles.sectionDescription}>
          {process_steps?.subtitle|| ''}
          </p>
        </div>

        <div className={styles.processGrid}>
          {steps.map((step) => (
            <div key={step.step} className={styles.processCard}>
              <div className={styles.processNumber}>{step.step}</div>
              <div className={styles.processIcon}>{getIcon(step.icon)}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {step.duration && (
                <span className={styles.processDuration}>{step.duration}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;