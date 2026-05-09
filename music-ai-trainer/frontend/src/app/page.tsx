'use client';

import { useState, useEffect } from 'react';
import { Upload, Play, Pause, Music, User, Mic } from 'lucide-react';
import Visualization from '../components/Visualization';
import RealTimeVisualization from '../components/RealTimeVisualization';
import AuthModal from '../components/AuthModal';

// Mock data for demonstration
const mockPitchData = [
  { time: 0, pitch: 220 },
  { time: 0.5, pitch: 230 },
  { time: 1, pitch: 240 },
  { time: 1.5, pitch: 260 },
  { time: 2, pitch: 270 },
  { time: 2.5, pitch: 280 },
  { time: 3, pitch: 290 },
  { time: 3.5, pitch: 300 },
  { time: 4, pitch: 310 },
  { time: 4.5, pitch: 320 },
  { time: 5, pitch: 330 },
];

const mockBreathingPoints = [
  { time: 1.2 },
  { time: 2.8 },
  { time: 4.1 }
];

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [pitchData, setPitchData] = useState<any[]>([]);
  const [breathingPoints, setBreathingPoints] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{name: string; email: string} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
      
      // Simulate processing
      setTimeout(() => {
        setPitchData(mockPitchData);
        setBreathingPoints(mockBreathingPoints);
      }, 1000);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAuthSuccess = (userData: {name: string; email: string}) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Music className="text-purple-500" />
          Music AI Trainer
        </h1>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="bg-gray-800 px-4 py-2 rounded-lg">{user.name}</span>
              <User className="w-8 h-8" />
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <User className="w-8 h-8" />
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-6">Upload Your Audio</h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center mb-6 transition-colors hover:border-purple-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">Drag & drop your audio file here</p>
            <p className="text-gray-400 mb-6">or click to browse files</p>
            <input 
              type="file" 
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg cursor-pointer transition-colors">
              Choose File
            </label>
          </div>

          {audioFile && (
            <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg mb-6">
              <div>
                <p className="font-medium">{audioFile.name}</p>
                <p className="text-sm text-gray-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={togglePlayback}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isPlaying ? <Pause /> : <Play />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          )}
        </div>

        {(pitchData.length > 0 || breathingPoints.length > 0) && (
          <Visualization 
            pitchData={pitchData}
            breathingPoints={breathingPoints}
            isPlaying={isPlaying}
            onPlayPause={togglePlayback}
          />
        )}

        {/* Real-time visualization section */}
        <div className="mt-8">
          <RealTimeVisualization />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">Pitch Analysis</h3>
            <p className="text-gray-300">Real-time pitch tracking and visualization of your singing performance.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">Breathing Points</h3>
            <p className="text-gray-300">Automatic detection of optimal breathing points in your performance.</p>
          </div>
          
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">Lyrics Sync</h3>
            <p className="text-gray-300">Synchronized lyrics display with visual cues for better performance.</p>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <p>Upload your audio file or use live microphone input</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <p>AI analyzes pitch, rhythm, and breathing patterns</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <p>Receive visual feedback for improvement</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
        <p>Music AI Trainer - Empowering musicians with AI-powered learning tools</p>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}