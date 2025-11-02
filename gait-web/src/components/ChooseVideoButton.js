'use client';

import { useState } from 'react';
import styles from './ChooseVideoButton.module.css';

export default function ChooseVideoButton({ onFileSelect }) {
  const [videoFile, setVideoFile] = useState(null);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);  
      onFileSelect(file);  
    }
  };

  // Trigger the hidden file input
  const handleButtonClick = () => {
    document.getElementById('video-file').click();  
  };

  return (
    <div className={styles.container}>
      <button className={styles.chooseButton} onClick={handleButtonClick}>
        Choose Video
      </button>


      <input
        type="file"
        accept="video/*"
        className={styles.fileInput}
        onChange={handleFileChange}
        id="video-file"
        style={{ display: 'none' }}  
      />
    </div>
  );
}
