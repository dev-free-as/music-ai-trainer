'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';

const RealTimeVisualization = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [pitchData, setPitchData] = useState<{time: number; pitch: number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize Web Audio API
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Set up analyser properties
      analyser.fftSize = 256;
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Start recording and visualization
  const startRecording = async () => {
    if (!isRecording) {
      await initAudio();
      setIsRecording(true);
      visualize();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    cancelAnimationFrame(animationFrameRef.current);
  };

  // Visualization function
  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get frequency data
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Draw visualization
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      
      // Create gradient color based on frequency
      const hue = (i / bufferLength) * 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }

    // Update audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    setAudioLevel(average / 255);

    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopRecording();
    };
  }, []);

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-bold mb-4">Live Recording</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button 
            onClick={toggleRecording}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRecording ? <Pause /> : <Mic />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className="w-4 h-4" />
          <span>Audio Level: {(audioLevel * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="relative h-64 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700 mb-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <p className="text-gray-300">Click "Start Recording" to begin live audio visualization</p>
          </div>
        )}
      </div>

      {/* Pitch data display */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400">Current Audio Level</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-100"
              style={{ width: `${audioLevel * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400">Microphone Status</p>
          <p className={`font-bold ${isRecording ? 'text-green-400' : 'text-red-400'}`}>
            {isRecording ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeVisualization;