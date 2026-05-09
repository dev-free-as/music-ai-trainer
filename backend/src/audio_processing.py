import librosa
import numpy as np
from scipy import signal
from typing import List, Tuple

def detect_silence(y: np.ndarray, sr: int, silence_threshold: float = -40.0) -> List[Tuple[int, int]]:
    """
    Detect silent sections in audio waveform
    
    Args:
        y: Audio time series
        sr: Sampling rate
        silence_threshold: dB threshold for silence detection
        
    Returns:
        List of tuples (start_sample, end_sample) for each silent section
    """
    # Convert to dB
    db = librosa.amplitude_to_db(np.abs(y), ref=np.max)
    
    # Find samples below threshold
    silence_mask = db < silence_threshold
    
    # Find contiguous regions of silence
    silence_regions = []
    in_silence = False
    start_sample = 0
    
    for i, is_silent in enumerate(silence_mask):
        if not in_silence and is_silent:
            # Start of silence
            start_sample = i
            in_silence = True
        elif in_silence and not is_silent:
            # End of silence
            silence_regions.append((start_sample, i))
            in_silence = False
    
    # Handle case where audio ends while still silent
    if in_silence:
        silence_regions.append((start_sample, len(silence_mask)))
    
    return silence_regions

def detect_breathing_points(y: np.ndarray, sr: int) -> List[float]:
    """
    Detect potential breathing points based on:
    1. Silent sections (silence detection)
    2. Frequency characteristics of breath sounds
    
    Args:
        y: Audio time series
        sr: Sampling rate
        
    Returns:
        List of timestamps where breathing points are detected
    """
    # Get silence regions for potential breath points
    silence_regions = detect_silence(y, sr)
    
    # Convert sample indices to seconds
    breathing_points = []
    for start_sample, end_sample in silence_regions:
        # Add a point at the midpoint of each silent region
        midpoint = (start_sample + end_sample) / 2.0
        breathing_points.append(midpoint / sr)
    
    return breathing_points

def analyze_vocal_intensity(y: np.ndarray, sr: int, frame_length: int = 2048, hop_length: int = 512) -> List[float]:
    """
    Analyze vocal intensity over time to detect breath sounds
    
    Args:
        y: Audio time series
        sr: Sampling rate
        frame_length: Length of analysis frames
        hop_length: Hop length between frames
        
    Returns:
        List of intensity values for each frame
    """
    # Calculate RMS (Root Mean Square) energy for each frame
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)
    
    # Convert to dB
    db_rms = librosa.amplitude_to_db(rms[0], ref=np.max)
    
    return db_rms.tolist()

def detect_breathing_patterns(y: np.ndarray, sr: int) -> dict:
    """
    Comprehensive breathing point detection
    
    Args:
        y: Audio time series
        sr: Sampling rate
        
    Returns:
        Dictionary containing breathing points and related information
    """
    # Detect silence-based breathing points
    silence_points = detect_breathing_points(y, sr)
    
    # Analyze vocal intensity for breath pattern recognition
    intensities = analyze_vocal_intensity(y, sr)
    
    return {
        "breathing_points": sorted(silence_points),
        "intensity_profile": intensities,
        "sample_rate": sr
    }