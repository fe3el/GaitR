import React, { useState } from 'react';
import styles from './AnalyzeButton.module.css';

interface AnalyzeButtonProps {
  videoFile: File | null;
  selectedAngle: string;
  onAnalyze: () => void;  // Expecting `onAnalyze` as a prop
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ videoFile, selectedAngle, onAnalyze }) => {
  const [prediction, setPrediction] = useState<any>(null);  // You can replace `any` with a more specific type if needed
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!videoFile || !selectedAngle) {
      alert("Please provide both video and angle.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('video', videoFile);  // Make sure videoFile is not null
    formData.append('angle', selectedAngle);

    try {
      const response = await fetch('http://localhost:5000/prediction', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = {styles.container} >
      <button
        className={styles.analyzeButton}
        onClick={() => {
          handleAnalyze();
          onAnalyze(); // Call onAnalyze from the parent
        }}
        disabled={loading || !videoFile || !selectedAngle}
      >
        {loading ? 'Analyzing...' : 'Analyze Gait'}
      </button>

      {prediction && (
        <div>
          <h3>Prediction Result:</h3>
          <p>{JSON.stringify(prediction)}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzeButton;
