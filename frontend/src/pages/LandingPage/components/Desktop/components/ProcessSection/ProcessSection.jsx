// import * as Icons from 'lucide-react';
// import React from 'react';
// import SectionHeader from '../SectionHeader/SectionHeader';
// import styles from './ProcessSteps.module.css';

// const ProcessSteps = ({ steps, title = 'خطوات الإجراء' }) => {
//   const getIcon = (iconName) => {
//     const Icon = Icons[iconName];
//     return Icon ? <Icon size={32} /> : null;
//   };

//   return (
//     <section className={styles.processSection}>
//       <div className={styles.container}>
//         <SectionHeader 
//           badge="خطوات الإجراء"
//           title="رحلة تحولك"
//           highlightText="خطوة بخطوة"
//           description="نرافقك في كل مرحلة لضمان أفضل النتائج"
//         />
        
//         <div className={styles.processGrid}>
//           {steps.map((step) => (
//             <div key={step.step} className={styles.processCard}>
//               <div className={styles.processNumber}>{step.step}</div>
//               <div className={styles.processIcon}>
//                 {getIcon(step.icon)}
//               </div>
//               <h3>{step.title}</h3>
//               <p>{step.desc}</p>
//               <span className={styles.processDuration}>{step.duration}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProcessSteps;