# Heart Disease Prediction System (ML Dashboard)

A production-ready full-stack web application that predicts heart disease risk using five supervised machine learning models. Built with a FastAPI backend and a modern React/Tailwind frontend.

## 🚀 Features
- **5 ML Models**: Logistic Regression, Decision Tree, Random Forest, SVM, and KNN.
- **Dynamic Dashboard**: Visualize model performance metrics (Accuracy, F1, ROC-AUC) using Recharts.
- **Model Analysis**: Detailed Confusion Matrices and Feature Importance visualizations.
- **Patient Prediction**: Real-time diagnostic tool with majority-vote consensus from all models.
- **Premium UI**: Dark-themed medical dashboard with glassmorphism and smooth animations.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide-React.
- **Backend**: FastAPI, Uvicorn, Scikit-Learn, Pandas, Joblib.
- **ML Pipeline**: Custom preprocessing, scaling, and training logic for the UCI/Heart Failure dataset.

## 📁 Project Structure
```text
heart-disease-ml-project/
├── backend/
│   ├── main.py              # FastAPI endpoints
│   ├── model_training.py    # ML pipeline script
│   ├── utils.py             # Preprocessing & helper logic
│   ├── heart.csv            # Dataset
│   └── models/              # Saved model artifacts (.joblib)
└── frontend/
    ├── src/
    │   ├── components/      # UI components (Sidebar, StatsCard, etc.)
    │   ├── pages/           # Application views (Dashboard, Predict, etc.)
    │   └── services/        # API service layer (Axios)
    ├── vite.config.js
    └── tailwind.config.js
```

## ⚙️ Setup & Installation

### Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the training script (optional, models are pre-trained):
   ```bash
   python model_training.py
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Dataset
The dataset includes 11 clinical features:
- Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, and ST_Slope.
- **Target**: `HeartDisease` (1 = positive risk, 0 = no risk).
