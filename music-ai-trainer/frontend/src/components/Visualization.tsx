'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Mic } from 'lucide-react';

interface PitchData {
  time: number;
  pitch: number;
}

interface BreathingPoint {
  time: number;
}

const Visualization = ({ 
  pitchData,
  breathingPoints,
  isPlaying,
  onPlayPause
}: { 
  pitchData?: PitchData[];
  breathingPoints?: BreathingPoint[];
  isPlaying: boolean;
  onPlayPause: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!pitchData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
    ctx.lineWidth = 1;
    
    // Vertical lines (time)
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines (pitch)
    for (let i = 0; i <= 8; i++) {
      const y = (i / 8) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (!pitchData || pitchData.length === 0) return;

    // Draw pitch line
    ctx.strokeStyle = '#8B5CF6'; // Purple color for pitch
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxPitch = Math.max(...pitchData.map(d => d.pitch), 1);
    const minPitch = Math.min(...pitchData.map(d => d.pitch), 0);

    const pitchRange = maxPitch - minPitch || 1;

    for (let i = 0; i < pitchData.length; i++) {
      const point = pitchData[i];
      
      // Normalize time to canvas width
      const x = (point.time / (pitchData[pitchData.length - 1].time || 1)) * canvas.width;
      
      // Normalize pitch to canvas height (invert Y axis)
      const y = canvas.height - ((point.pitch - minPitch) / pitchRange) * canvas.height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw breathing points
    if (breathingPoints && breathingPoints.length > 0) {
      ctx.fillStyle = '#10B981'; // Green color for breathing points
      
      breathingPoints.forEach(point => {
        const x = (point.time / (pitchData[pitchData.length - 1].time || 1)) * canvas.width;
        
        // Draw circle at breathing point
        ctx.beginPath();
        ctx.arc(x, canvas.height/2, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    setIsDrawing(false);
  }, [pitchData, breathingPoints]);

  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-xl font-bold mb-4">Performance Visualization</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button 
            onClick={onPlayPause}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isPlaying ? <Pause /> : <Play />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RotateCcw />
            Reset
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Mic className="w-4 h-4" />
          <span>Live Input</span>
        </div>
      </div>

      <div className="relative h-64 bg-gray-900/50 rounded-lg overflow-hidden border border-gray-700">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        
        {isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">Loading visualization...</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400">Max Pitch</p>
          {pitchData && pitchData.length > 0 ? (
            <p className="font-bold">{Math.max(...pitchData.map(d => d.pitch)).toFixed(1)} Hz</p>
          ) : (
            <p>-</p>
          )}
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400">Avg Pitch</p>
          {pitchData && pitchData.length > 0 ? (
            <p className="font-bold">{(pitchData.reduce((sum, d) => sum + d.pitch, 0) / pitchData.length).toFixed(1)} Hz</p>
          ) : (
            <p>-</p>
          )}
        </div>
        
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-gray-400">Breathing Points</p>
          {breathingPoints && breathingPoints.length > 0 ? (
            <p className="font-bold">{breathingPoints.length}</p>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualization;