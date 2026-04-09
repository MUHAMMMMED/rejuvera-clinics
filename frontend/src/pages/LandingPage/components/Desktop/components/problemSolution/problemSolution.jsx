import React from 'react';
import styles from './ProblemSolution.module.css';

const ProblemSolution = ({ problem_solution }) => {
  if (!problem_solution) return null;
  
  return (
    <section className={styles.problemSolution}>
      <div className={styles.problemSolutionWrapper}>
        {/* Problem Card */}
        <div className={styles.problemCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardText}>
              <span className={styles.sectionBadge}>المشكلة</span>
              <h2>{problem_solution.problem_title}</h2>
              <p>{problem_solution.problem_description}</p>
            </div>
            <div className={styles.cardImage}>
              <img src={problem_solution.problem_image} alt="Problem" />
              <div className={styles.imageGlow} />
            </div>
          </div>
        </div>
        
        {/* Solution Card */}
        <div className={styles.solutionCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardImage}>
              <img src={problem_solution.solution_image} alt="Solution" />
              <div className={styles.imageGlow} />
            </div>
            <div className={styles.cardText}>
              <span className={styles.sectionBadge}>الحل</span>
              <h2>{problem_solution.solution_title}</h2>
              <p>{problem_solution.solution_description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;