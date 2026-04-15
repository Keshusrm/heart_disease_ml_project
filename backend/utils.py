import os
import joblib
import pandas as pd
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_artifact(name):
    return joblib.load(os.path.join(MODELS_DIR, f"{name}.joblib"))

def preprocess_input(data):
    scaler = load_artifact("scaler")
    label_encoders = load_artifact("label_encoders")
    feature_names = load_artifact("feature_names")
    
    df = pd.DataFrame([data])
    for col, le in label_encoders.items():
        if col in df.columns:
            df[col] = le.transform(df[col])
            
    df = df[feature_names]
    return scaler.transform(df)

def get_all_predictions(input_data):
    models = ["logistic_regression", "decision_tree", "random_forest", "svm", "knn"]
    results = []
    
    scaled_input = preprocess_input(input_data)
    
    for m_name in models:
        try:
            model = load_artifact(m_name)
            pred = model.predict(scaled_input)[0]
            prob = model.predict_proba(scaled_input)[0][1] if hasattr(model, "predict_proba") else 0.5
            results.append({
                "model": m_name.replace("_", " ").title(),
                "prediction": int(pred),
                "probability": float(prob)
            })
        except Exception as e:
            results.append({"model": m_name, "error": str(e)})
            
    return results
