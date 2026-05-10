import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib
import os

MODEL_PATH = "student_risk_model.joblib"

def train_initial_model():
    """Train a simple logistic regression model with synthetic logic if not exists."""
    print("Training initial ML model...")
    # X: [task_completion_rate, attendance_rate]
    # y: at_risk (1 if risk, 0 if not)
    X = np.array([
        [0.1, 0.1], [0.2, 0.3], [0.3, 0.2], [0.4, 0.4], # At Risk
        [0.6, 0.6], [0.7, 0.8], [0.8, 0.7], [0.9, 0.9], # Not At Risk
        [0.5, 0.5], [0.55, 0.45], [0.45, 0.55]         # Borderline
    ])
    y = np.array([1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1])
    
    model = LogisticRegression()
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    return model

def get_model():
    """Load or train the model."""
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except:
            return train_initial_model()
    else:
        return train_initial_model()

def predict_risk(task_completion_rate, attendance_rate):
    """Predict risk using the trained model."""
    model = get_model()
    prediction = model.predict([[task_completion_rate, attendance_rate]])
    return int(prediction[0])
