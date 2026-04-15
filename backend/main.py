from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import subprocess
from .utils import load_artifact, get_all_predictions

app = FastAPI(title="Heart Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    Age: int
    Sex: str
    ChestPainType: str
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: str
    MaxHR: int
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str

@app.on_event("startup")
async def startup_event():
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    if not os.path.exists(models_dir) or not os.listdir(models_dir):
        print("Models not found. Training models...")
        subprocess.run(["python3", "model_training.py"], cwd=os.path.dirname(__file__))

@app.get("/models")
async def get_models_list():
    return {"models": ["Logistic Regression", "Decision Tree", "Random Forest", "SVM", "KNN"]}

@app.get("/metrics")
async def get_metrics():
    try:
        return {
            "metrics": load_artifact("metrics"),
            "dataset_info": load_artifact("dataset_info")
        }
    except:
        raise HTTPException(status_code=500, detail="Metrics not available")

@app.get("/confusion-matrix")
async def get_confusion_matrix():
    return {"confusion_matrices": load_artifact("confusion_matrices")}

@app.get("/roc-data")
async def get_roc_data():
    return {"roc_data": load_artifact("roc_data")}

@app.get("/feature-importance")
async def get_feature_importance():
    return {"feature_importance": load_artifact("feature_importance")}

@app.post("/predict")
async def predict(data: PatientData):
    try:
        predictions = get_all_predictions(data.dict())
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
