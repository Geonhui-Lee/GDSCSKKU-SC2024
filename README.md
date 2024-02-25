# README

# TeleTect

## Getting Started

Before getting started, you must have the following on your machine.

- Frontend:
    - Node.js ([https://nodejs.org/en](https://nodejs.org/en))
    - Ionic CLI ([https://ionicframework.com/docs/intro/cli](https://ionicframework.com/docs/intro/cli))
    - Capacitor CLI ([https://capacitorjs.com/docs/getting-started](https://capacitorjs.com/docs/getting-started))
    - Android Studio (including Android SDK installation)
- Backend:
    - Python 3.8
    - Python modules declared on requirements.txt (pip install -r requirements.txt)
    - Java (some Python modules require JDK)
    - gcloud CLI (requires setting up application credentials)

### Frontend

The frontend project includes two principal parts:

- Web-level project (Ionic UI-toolkit-based web application) [Root directory: `/2t_frontend`]
- Native-level project (Android Studio Project) [Root directory: `/2t_frontend/android`]

To deploy an Android application, you must first build the web-level project through Capacitor, then use Android Studio to build the native-level application (APK).

1. Please confirm the following before setting up the project.
    - Node.js
    - Ionic CLI
    - Capacitor CLI
    - Android Studio
    - Android SDK
2. Run the following commands to set up the web-level project.
    
    ```tsx
    npm install
    ```
    
3. Set up the web-level project’s environment variable (`/2t_frontend/.env`) based on the template file (`/2t_frontend/.env.template`).
4. Run the following commands to build the web-level project and sync with the native-level project.
    
    ```tsx
    npm run build
    npx cap sync
    ```
    
5. Open the Android Studio project using the following command. (Alternatively, you can open `/2t_frontend/android` on Android Studio)
    
    ```tsx
    npx cap open android
    ```
    
6. Use Android Studio tools to run the frontend project as an Android application.
    - Documentation: [https://developer.android.com/studio/run](https://developer.android.com/studio/run)

### Backend

1. Please confirm the following before setting up the project.
    - Python 3.8 (Note: As KoBERT uses the legacy versions of some modules, running the backend application on the environment beyond Python 3.8 may not work.)
    - Java (some Python modules require JDK) `sudo apt install openjdk-11-jdk`
    - gcloud CLI (requires setting up application credentials)
2. Run the following commands to set up the project.
    
    ```tsx
    cd 2t_backend
    pip install -r requirements.txt
    ```
    
3. Set up application credentials using gcloud CLI.
    - Documentation: [https://cloud.google.com/docs/authentication/gcloud](https://cloud.google.com/docs/authentication/gcloud)
4. Proceed with the following to set up the voice phishing detection features.
    - KoBERT: Locate the trained model file (teletect_kobert_train.pt) to the following directory: `/2t_backend/teletect/detection/kobert_detection/KoBERTModel/model`. You can acquire the model file through the following methods:
        - Method 1: Run `train_kobert_detection.py` on the local machine.
        - Method 2: Download our pre-trained model file from the following URL and locate it in the model directory.
            
            [teletect_kobert_train.pt](README%20c13a602c73954d028ad69a4c1faa90d1/teletect_kobert_train.pt)
            
    - Vertex AI/Gemini: No further actions are necessary if the application credentials setup is complete.
5. Set up the environment variable (`.env`) based on the template file (`.env.template`).
    - The environment variable file should be located in `/2t_backend/.env`
6. Run the backend server using the following command.
    
    ```tsx
    uvicorn main:app --reload
    ```
    

## Notes:

### [Backend] Voice Phishing Detection (KoBERT)

- Voice phishing detection works faster on a GPU server that supports CUDA.
- To force the backend to run the detection on CPU mode, set the environment variable `DETECTION_FORCE_CPU` to `true`.