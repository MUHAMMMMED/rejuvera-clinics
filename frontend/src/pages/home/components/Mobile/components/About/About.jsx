import { Award, Heart, ShieldCheck, Target, Users } from 'lucide-react';
import React from 'react';
import styles from './About.module.css';

const AboutMobile = () => {
  const features = [
    { icon: ShieldCheck, title: 'أمان وخصوصية', desc: 'نلتزم بأعلى معايير السرية' },
    { icon: Award, title: 'جودة معتمدة', desc: 'أجهزة وتقنيات عالمية' },
    { icon: Heart, title: 'رعاية استثنائية', desc: 'اهتمام شخصي فاخر' },
    { icon: Users, title: 'أطباء خبراء', desc: 'نخبة من الاستشاريين' },
  ];

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          
          {/* الجانب الأيمن: من نحن + العنوان + الإحصائيات */}
          <div className={styles.rightSection}>
            <div className={styles.titleArea}>
              <div className={styles.titleRow}>
                {/* <span className={styles.badge}>من نحن</span> */}
                <h2 className={styles.mainTitle}>
                  نحن نصيغ <span className={styles.gold}>الجمال</span><br />
                  بأعلى المعايير
                </h2>
              </div>
              <p className={styles.subtitle}>
                من أفضل مراكز التجميل في الرياض المختصة في الجراحات التجميلية بأحدث الأجهزة للحصول على أفضل النتائج.
              </p>
            </div>

            {/* الإحصائيات */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>+15</span>
                <span className={styles.statLabel}>سنة خبرة</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>+5000</span>
                <span className={styles.statLabel}>عملية ناجحة</span>
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: الرؤية + المميزات */}
          <div className={styles.leftSection}>
            {/* الرؤية - تأخذ العرض كامل */}
            <div className={styles.visionCard}>
              <div className={styles.visionIconRight}>
                <Target size={26} strokeWidth={1.6} />
              </div>
              <div className={styles.visionText}>
                <h3>الرؤية</h3>
                <p>
                  أن نكون أفضل المراكز في مجال الجراحات التجميلية في المملكة والشرق الأوسط
                </p>
              </div>
            </div>

            {/* المميزات - شبكة 2×2 */}
            <div className={styles.featuresGrid}>
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={styles.featureCard}>
                    <div className={styles.featureContent}>
                      <div className={styles.iconRight}>
                        <Icon size={22} strokeWidth={1.8} />
                      </div>
                      <div className={styles.textLeft}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutMobile;