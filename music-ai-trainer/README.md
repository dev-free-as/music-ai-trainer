# Music AI Trainer

An AI-powered music learning platform that separates vocals from audio, analyzes pitch and breathing points, and provides real-time visual feedback for musical performance improvement.

## Project Structure

```
music-ai-trainer/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Features

1. **Vocal Separation**: Uses Spleeter/Demucs to separate vocals from instrumental tracks
2. **Pitch Analysis**: Real-time pitch tracking using Librosa
3. **Breathing Point Detection**: Automatic detection of optimal breathing points in performances
4. **Real-time Visualization**: Web Audio API for live microphone input analysis
5. **Interactive UI**: Dark mode with glass-morphism design and smooth animations

## Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

### Backend
- FastAPI (Python)
- WebSocket for real-time communication
- Librosa (pitch analysis)
- Spleeter (vocal separation)
- PyTorch

### Infrastructure
- PostgreSQL (user data storage)
- Redis (caching)
- Docker Compose (containerization)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Build and start containers:
```bash
docker-compose up --build
```

3. Access the application at `http://localhost:3000`

## API Endpoints

- `GET /` - Health check endpoint
- `POST /process-audio` - Process audio file for pitch analysis
- `WS /ws` - WebSocket connection for real-time communication

## Development

### Frontend Development
```bash
cd frontend
yarn dev
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```

## Deployment

The application is designed to run in a Docker environment on an Ubuntu server with Proxmox virtualization.

For production deployment:
1. Configure environment variables
2. Set up proper SSL certificates
3. Optimize audio processing for performance
4. Implement user authentication and authorization