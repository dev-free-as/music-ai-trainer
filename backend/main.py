from fastapi import FastAPI, WebSocket, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import uuid
from typing import Dict, Any
import librosa
import numpy as np
from pydantic import BaseModel
import os

app = FastAPI(title="Music AI Trainer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (in production, use PostgreSQL)
user_db: Dict[str, Any] = {}
analysis_results: Dict[str, Any] = {}

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

@app.get("/")
async def root():
    return {"message": "Music AI Trainer API"}

@app.post("/auth/register")
async def register_user(user: UserRegister):
    # In a real app, this would hash the password and store in DB
    user_id = str(uuid.uuid4())
    user_db[user_id] = {
        "name": user.name,
        "email": user.email,
        "password": user.password  # In production, hash this!
    }
    return {"user_id": user_id, "message": "User registered successfully"}

@app.post("/auth/login")
async def login_user(user: UserLogin):
    # Find user (in real app, check password)
    for user_id, user_data in user_db.items():
        if user_data["email"] == user.email:
            return {"user_id": user_id, "name": user_data["name"]}
    
    return {"error": "Invalid credentials"}

@app.websocket("/ws/analyze")
async def analyze_audio(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Receive analysis request
        data = await websocket.receive_text()
        request = json.loads(data)
        
        # Simulate processing (in real app, this would use Spleeter/Demucs and Librosa)
        await asyncio.sleep(2)  # Simulate AI processing time
        
        # Generate mock pitch data
        pitch_data = []
        for i in range(0, 10):
            pitch_data.append({
                "time": i,
                "pitch": 200 + np.random.randint(-50, 50)
            })
        
        # Generate mock breathing points (randomly spaced)
        breathing_points = []
        for i in range(3):
            breathing_points.append({
                "time": round(np.random.uniform(1, 9), 2)
            })
            
        result = {
            "pitch_data": pitch_data,
            "breathing_points": breathing_points,
            "status": "completed"
        }
        
        # Send results back
        await websocket.send_text(json.dumps(result))
        
    except Exception as e:
        error_msg = {"error": str(e)}
        await websocket.send_text(json.dumps(error_msg))
    
    await websocket.close()

@app.post("/api/analyze")
async def analyze_uploaded_audio(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    # In a real app, this would save the file and process it
    print(f"Processing audio for user {user_id}")
    
    # Simulate processing time
    await asyncio.sleep(2)
    
    # Generate mock results
    pitch_data = []
    for i in range(0, 10):
        pitch_data.append({
            "time": i,
            "pitch": 200 + np.random.randint(-50, 50)
        })
        
    breathing_points = []
    for i in range(3):
        breathing_points.append({
            "time": round(np.random.uniform(1, 9), 2)
        })
    
    analysis_id = str(uuid.uuid4())
    analysis_results[analysis_id] = {
        "user_id": user_id,
        "file_name": file.filename,
        "pitch_data": pitch_data,
        "breathing_points": breathing_points
    }
    
    return {"analysis_id": analysis_id, "status": "processing"}

@app.get("/api/analysis/{analysis_id}")
async def get_analysis_results(analysis_id: str):
    if analysis_id in analysis_results:
        return analysis_results[analysis_id]
    return {"error": "Analysis not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)