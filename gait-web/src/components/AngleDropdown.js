'use client';

import { useState } from 'react';
import styles from './AngleDropdown.module.css';  

export default function AngleDropdown({onAngleChange}) {
  const [selectedAngle, setSelectedAngle] = useState('0°');  

  const handleAngleChange = (event) => {
    setSelectedAngle(event.target.value);
    onAngleChange(event.target.value);  
  };

  return (
    <div className={styles.container}>  
      <div className={styles['dropdown-container']}>
        <label htmlFor="angle-select">Select Angle:</label>
        <select id="angle-select" value={selectedAngle} onChange={handleAngleChange}>
          <option value="0">0°</option>
          <option value="45">45° / 54°</option>
          <option value="90">90°</option>
        </select>
      </div>
    </div>
  );
}
