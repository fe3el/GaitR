'use client';

import React, { useState } from "react";
import AngleDropdown from "@/components/AngleDropdown";
import ChooseVideoButton from "@/components/ChooseVideoButton";
import VideoPreview from "@/components/VideoPreview"; 
import AnalyzeButton from "@/components/AnalyzeButton";
import ReturnButton from "@/components/ReturnButton";

// Define the type for the prediction state
interface Prediction {
  predicted_class: string;
  confidence: number;
}

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedAngle, setSelectedAngle] = useState('0');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false); 

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setVideoFile(file);  
  };

  const handleAngleChange = (angle: string) => {
    setSelectedAngle(angle);
  };

  // Handle analysis button click
  const handleAnalyze = async () => {
    if (!videoFile || !selectedAngle) {
      alert("Please select a video and an angle before analyzing.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("angle", selectedAngle);

    try {
      const response = await fetch('http://localhost:5000/prediction', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction({
        predicted_class: data.predicted_class,
        confidence: data.confidence
      });

      setAnalysisComplete(true); // Mark analysis as complete
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    // Reset the page to the initial state
    setVideoFile(null);
    setSelectedAngle('0');
    setPrediction(null);
    setAnalysisComplete(false);
  };

  return (
    <div className="main-container">
      <h1>Gait Recognition Using LSTM</h1>

      <VideoPreview videoFile={videoFile} />

      {loading && <p>Analyzing video, please wait...</p>}

      {!analysisComplete && !loading && (
        <div>
          <div className="dropdown-container">
            <AngleDropdown onAngleChange={handleAngleChange} />
          </div>

          <div className="button-container">
            <ChooseVideoButton onFileSelect={handleFileSelect} />
            {videoFile && selectedAngle && (
              <AnalyzeButton onAnalyze={handleAnalyze} videoFile={videoFile} selectedAngle={selectedAngle} />
            )}
          </div>
        </div>
      )}

      {analysisComplete && !loading && (
        <div>
          <h3>Prediction Result:</h3>
          <p><strong>Predicted Class:</strong> {prediction?.predicted_class}</p>
          <p><strong>Confidence Score:</strong> {prediction?.confidence}</p>

          <ReturnButton onReturn={handleReturn} />
        </div>
      )}
    </div>
  );
}
