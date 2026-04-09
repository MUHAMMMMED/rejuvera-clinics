import { CheckCircle2, X } from 'lucide-react';
import React from 'react';
import styles from './About.module.css';

const About = ({ data }) => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.problemCard}>
        <div className={styles.problemText}>
          <h3>
            <X size={20} color="#e74c3c" />
            {data.problem_title}
          </h3>
          <p>{data.problem_description}</p>
        </div>
        {data.problem_image && (
          <div className={styles.problemImage}>
            <img src={data.problem_image} alt="Problem" />
          </div>
        )}
      </div>
      
      <div className={styles.solutionCard}>
        {data.solution_image && (
          <div className={styles.solutionImage}>
            <img src={data.solution_image} alt="Solution" />
          </div>
        )}
        <div className={styles.solutionText}>
          <h3>
            <CheckCircle2 size={20} color="#27ae60" />
            {data.solution_title}
          </h3>
          <p>{data.solution_description}</p>
        </div>
      </div>
    </section>
  );
};

export default About;