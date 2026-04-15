import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve

MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

def load_and_preprocess(filepath="heart.csv"):
    df = pd.read_csv(filepath)
    categorical_cols = ["Sex", "ChestPainType", "RestingECG", "ExerciseAngina", "ST_Slope"]
    
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
        
    X = df.drop("HeartDisease", axis=1)
    y = df["HeartDisease"]
    feature_names = list(X.columns)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, label_encoders, feature_names, df

def train_and_evaluate():
    print("Loading and preprocessing data...")
    X_train, X_test, y_train, y_test, scaler, label_encoders, feature_names, df = load_and_preprocess()
    
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.joblib"))
    joblib.dump(label_encoders, os.path.join(MODELS_DIR, "label_encoders.joblib"))
    joblib.dump(feature_names, os.path.join(MODELS_DIR, "feature_names.joblib"))
    
    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42, n_estimators=100),
        "SVM": SVC(random_state=42, probability=True),
        "KNN": KNeighborsClassifier(n_neighbors=5)
    }
    
    metrics = {}
    confusion_matrices = {}
    roc_data = {}
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else model.decision_function(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc = roc_auc_score(y_test, y_prob)
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        
        metrics[name] = {
            "accuracy": float(acc), "precision": float(prec), "recall": float(rec),
            "f1_score": float(f1), "roc_auc": float(roc),
            "cross_val_mean": float(cv_scores.mean()), "cross_val_std": float(cv_scores.std())
        }
        confusion_matrices[name] = confusion_matrix(y_test, y_pred).tolist()
        roc_data[name] = {"fpr": fpr.tolist(), "tpr": tpr.tolist(), "auc": float(roc)}
        joblib.dump(model, os.path.join(MODELS_DIR, f"{name.replace(' ', '_').lower()}.joblib"))
        print(f"  ✓ {name}: Accuracy={acc:.4f}")
        
    # Standardizing naming to match existing expectations if any
    joblib.dump(metrics, os.path.join(MODELS_DIR, "metrics.joblib"))
    joblib.dump(confusion_matrices, os.path.join(MODELS_DIR, "confusion_matrices.joblib"))
    joblib.dump(roc_data, os.path.join(MODELS_DIR, "roc_data.joblib"))
    
    dataset_info = {
        "total_samples": len(df), "features": feature_names,
        "positive_cases": int(df["HeartDisease"].sum()),
        "negative_cases": int(len(df) - df["HeartDisease"].sum())
    }
    joblib.dump(dataset_info, os.path.join(MODELS_DIR, "dataset_info.joblib"))
    
    fi_data = {"features": feature_names, "importance": models["Random Forest"].feature_importances_.tolist()}
    joblib.dump(fi_data, os.path.join(MODELS_DIR, "feature_importance.joblib"))
    print("✅ Done.")

if __name__ == "__main__":
    train_and_evaluate()
