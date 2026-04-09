import { Clock, Heart, Shield, Sparkles } from 'lucide-react';
import React from 'react';
import styles from './BenefitsSection.module.css';

const BenefitsSection = ({ feature }) => {
  if (!feature) return null;

  // بناء مصفوفة الفوائد مع الأيقونات الجديدة
  const benefits = [
    {
      title: feature.results_title,
      description: feature.results_description,
      icon: Sparkles  // أيقونة نتائج فورية
    },
    {
      title: feature.safety_title,
      description: feature.safety_description,
      icon: Shield    // أيقونة آمن تماماً
    },
    {
      title: feature.recovery_title,
      description: feature.recovery_description,
      icon: Clock     // أيقونة تعافي سريع
    },
    {
      title: feature.care_title,
      description: feature.care_description,
      icon: Heart     // أيقونة رعاية شاملة
    }
  ].filter(benefit => benefit.title && benefit.description); // حذف أي عنصر ناقص

  if (benefits.length === 0) return null;

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.container}>
        {/* الهيدر */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>لماذا ريجوفيرا؟</span>
          <h2>
            مميزات <span className={styles.gold}>{feature.title || 'خدمتنا'}</span>
          </h2>
          <p>{feature.subtitle || 'نقدم لك تجربة تجميلية استثنائية بأحدث التقنيات'}</p>
        </div>

        {/* شبكة البطاقات */}
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <IconComponent size={28} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;