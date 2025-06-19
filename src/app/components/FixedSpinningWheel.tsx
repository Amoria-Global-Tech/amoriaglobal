// components/FixedSpinningWheel.tsx
import React from 'react';
import styles from '../styles/FixedSpinningWheel.module.css';

interface FixedSpinningWheelProps {
  className?: string;
  position?: 'left' | 'center' | 'right';
  bottomOffset?: string;
}

const FixedSpinningWheel: React.FC<FixedSpinningWheelProps> = ({ 
  className = '', 
  position = 'center',
  bottomOffset = '100px'
}) => {
  return (
    <div 
      className={`${styles.wheelContainer} ${styles[position]} ${className}`} 
      style={{ bottom: bottomOffset }}
    >
      <div className={styles.wheel}>
        <div className={`${styles.ring} ${styles.ring1}`}></div>
        <div className={`${styles.ring} ${styles.ring2}`}></div>
        <div className={`${styles.ring} ${styles.ring3}`}></div>
        <div className={`${styles.ring} ${styles.ring4}`}></div>
        <div className={`${styles.ring} ${styles.ring5}`}></div>
      </div>
    </div>
  );
};

export default FixedSpinningWheel;