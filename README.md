#GaitR - Gait Recognition System
<img width="960" height="495" alt="image" src="https://github.com/user-attachments/assets/74de263b-5a44-4dad-ab99-06d4915c2437" />
Author: Khafillah Akbar S.

Teknik Informatika — Politeknik Negeri Malang (2025)

This repository contains the implementation and analysis of my undergraduate thesis project on **Gait Recognition**, focusing on identifying individuals based on their walking patterns.   The study explores temporal features in gait sequences using **Long Short-Term Memory (LSTM)** networks, evaluated on **CASIA-B** and **OU-ISIR MVLP** datasets.

The system aims to identify individuals from surveillance-like gait footage using silhouette sequences processed through a Long Short-Term Memory (LSTM) deep learning model.

Two public benchmark datasets were used:

- **OU-ISIR Gait MVLP** — the largest gait dataset (>10,000 subjects)

- **CASIA-B** — multi-view dataset with varied walking conditions

The project includes:
✔ Preprocessing pipeline (silhouette cleanup, cropping, resizing)
✔ Feature extraction → vectorization per frame
✔ LSTM sequential model training
✔ Web-based gait recognition system (Next.js + Flask)
✔ Angle-based model selection (0°, 45°/54°, 90°)

## System Architecture
<img width="687" height="422" alt="image" src="https://github.com/user-attachments/assets/970ab434-db11-40a7-84a0-2d6209db5aed" />

## Web Page
### Main Menu
<img width="894" height="464" alt="image" src="https://github.com/user-attachments/assets/fccec021-d68c-494f-8e2e-66c5b99dd56c" />

- In this section we can upload and choose the angle
<img width="960" height="495" alt="image" src="https://github.com/user-attachments/assets/1df9cd6c-d982-4277-9c79-0eafba5f3875" />
- This is the results of the prediction where it shows the predicted lable and confident score

## Steps to run the Application
- The Front end are built with Next.js, so make sure npm are installed, after that use this code to run the front end

```
npm run dev
```

The Website will be running in Localhost:3000

- The backend are built using Flask, to run the Flask, we just need to go to backend file and run

```
python server.py
```




