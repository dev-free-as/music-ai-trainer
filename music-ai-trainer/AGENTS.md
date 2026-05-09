# Repository Overview

## Project Description
This is a Music AI Trainer platform that helps musicians improve their performance through AI-powered analysis. The system separates vocals from audio, analyzes pitch and breathing points in real-time, and provides visual feedback for musical performance improvement.

Main purpose: To provide an interactive music learning environment with real-time audio analysis capabilities.

Key technologies used:
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion
- Backend: FastAPI (Python), WebSocket communication
- Audio Processing: Librosa, Spleeter/Demucs
- Infrastructure: Docker Compose, PostgreSQL, Redis

## Architecture Overview
The system follows a client-server architecture with:
- Frontend (Next.js) - Web interface for users
- Backend (FastAPI) - API server handling audio processing and user management
- Database (PostgreSQL) - User data storage
- Cache (Redis) - Temporary caching of analysis results

Data flows through WebSocket connections for real-time communication between frontend and backend, with file uploads for batch analysis.

## Directory Structure
```
music-ai-trainer/
├── frontend/           # Next.js web application
│   ├── src/            # Source code
│   └── package.json    # Frontend dependencies
├── backend/            # FastAPI server
│   ├── src/            # Python source files
│   ├── main.py         # Main API entry point
│   └── requirements.txt # Backend dependencies
├── docker-compose.yml  # Container orchestration
└── README.md           # Project documentation
```

## Development Workflow
### Building and Running:
```bash
docker-compose up --build
```
Access frontend at `http://localhost:3000` and backend API at `http://localhost:8000`.

### Frontend Development:
```bash
cd frontend
yarn dev
```

### Backend Development:
```bash
cd backend
uvicorn main:app --reload
```

### Testing Approach:
- Unit tests for core audio processing functions (not implemented yet)
- Integration testing through API endpoints

### Lint and Format Commands:
- Frontend: `yarn lint` 
- Backend: No specific linting mentioned but typically would use flake8 or black
