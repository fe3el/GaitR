from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS
import logging


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Initialize Flask app
CORS(app)

# Load the  models
model_casia_0 = load_model('models/casia-b/model_0_casia.h5')
model_casia_54 = load_model('models/casia-b/model_54_casia.h5')
model_casia_90 = load_model('models/casia-b/model_90_casia.h5')

model_mvlp_0 = load_model('models/model_0.h5')
model_mvlp_45 = load_model('models/model_45.h5')
model_mvlp_90 = load_model('models/model_90.h5')

# Path to save uploaded videos
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

output_root = 'output'
if not os.path.exists(output_root):
    os.makedirs(output_root)

# Capture frames at 25 FPS
def capture_frames_at_25(video_path, frame_count=60):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frames_interval = int(fps / 25)  
    frames = []

    while cap.isOpened() and len(frames) < frame_count:
        ret, frame = cap.read()
        if not ret:
            break
        if len(frames) % frames_interval == 0:
            frames.append(frame)
    
    print(f"Captured {len(frames)} frames.")
    cap.release()
    return frames

def tight_crop_frames(img, target_size=(88, 128)):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    _, binary = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)
    coords = cv2.findNonZero(binary)

    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        cropped_img = gray[y:y+h, x:x+w]

        old_h, old_w = cropped_img.shape[:2]
        target_w, target_h = target_size

        scale = min(target_w / old_w, target_h / old_h)
        new_w = int(old_w * scale)
        new_h = int(old_h * scale)

        resized = cv2.resize(cropped_img, (new_w, new_h), interpolation=cv2.INTER_AREA)

        top = (target_h - new_h) // 2
        bottom = target_h - new_h - top
        left = (target_w - new_w) // 2
        right = target_w - new_w - left

        padded = cv2.copyMakeBorder(resized, top, bottom, left, right, cv2.BORDER_CONSTANT, value=0)
    else:
        padded = np.zeros((target_size[1], target_size[0]), dtype=np.uint8)

    flattened_frame = padded.flatten()

    print(f"Padded frame shape: {padded.shape}, Flattened frame length: {len(flattened_frame)}")

    return flattened_frame



def process_and_save_video(video_path, output_path=output_root, angle='0', frame_count=60):
    frames = capture_frames_at_25(video_path, frame_count)
    if len(frames) == 0:
        print(f"Failed to capture frames from the video.")
        return

    processed_frames = []

    for idx, frame in enumerate(frames):
        cropped_frame = tight_crop_frames(frame)  
        processed_frames.append(cropped_frame)

        
        reshaped = cropped_frame.reshape(128, 88)  

        # Prepare output folder
        video_name = os.path.basename(video_path)
        video_folder = video_name.split('.')[0]
        output_folder = os.path.join(output_root, video_folder)
        os.makedirs(output_folder, exist_ok=True)

        # Save the reshaped image
        save_path = os.path.join(output_folder, f'frame_{idx+1:03d}.jpg')
        success = cv2.imwrite(save_path, reshaped)

        if success:
            print(f"Saved {save_path}")
        else:
            print(f"Failed to save {save_path}")

    # Convert list to numpy array
    processed_frames = np.array(processed_frames)

    # Predict using the appropriate model
    prediction = predict_gait(processed_frames, angle)

    print(f"Prediction for {video_path} (angle {angle}): {prediction}")
    return prediction


def predict_gait(frames, angle):
    if angle == '0':
        model = model_casia_0
        model_name = 'model_0'
    elif angle == '45':
        model = model_casia_54
        model_name = 'model_45'
    elif angle == '90':
        model = model_casia_90
        model_name = 'model_90'
    else:
        raise ValueError("Invalid angle, choose from '0', '45', or '90'.")
    # Log the selected model
    logging.info(f"Using {model_name} for prediction based on angle: {angle}")
    
    prediction = model.predict(frames)
    return prediction

#Endpoint 
@app.route('/prediction', methods=['POST'])
def prediction():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']
    angle = request.form.get('angle')

    video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(video_path)

    try:
    
        frames = capture_frames_at_25(video_path, frame_count=60)
        processed_frames = [tight_crop_frames(frame) for frame in frames]

        if len(processed_frames) < 60:
            padding = [np.zeros(88 * 128) for _ in range(60 - len(processed_frames))]
            processed_frames.extend(padding)

    
        processed_frames = np.array(processed_frames)

        processed_frames = np.expand_dims(processed_frames, axis=0)

        prediction = predict_gait(processed_frames, angle)

        predicted_class_index = np.argmax(prediction)
        predicted_class_confidence = float(prediction[0][predicted_class_index])
        
        class_names = ["Person 1", "Person 2", "Person 3", "Person 4", "Person 5", 
                       "Person 6", "Person 7", "Person 8", "Person 9", "Person 10"]
        predicted_class_name = class_names[predicted_class_index]

        # Log prediction
        print(f"Prediction Result - Class: {predicted_class_name}, Confidence: {predicted_class_confidence}")
      
        return jsonify({'predicted_class': predicted_class_name, 'confidence': predicted_class_confidence})

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500



@app.route('/')
def index():
    return "Welcome to the Gait Prediction API! Use the /prediction endpoint to upload a video and get predictions."

if __name__ == '__main__':
    app.run(debug=True)
