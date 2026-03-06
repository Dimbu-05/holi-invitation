import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './MusicPlayer.css';
import song from "../assets/audio/a1.mp3";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Starts at low volume
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const visualizerRef = useRef(null);

  useEffect(() => {
    // GSAP entrance animation from bottom right
    gsap.fromTo(playerRef.current,
      { x: 100, opacity: 0, scale: 0.5 },
      { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'back.out(1.5)', delay: 1 }
    );

    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      gsap.to(visualizerRef.current.children, {
        height: () => Math.random() * 15 + 5,
        duration: 0.3,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: 'sine.inOut'
      });
    } else {
      audioRef.current.pause();
      gsap.killTweensOf(visualizerRef.current.children);
      gsap.to(visualizerRef.current.children, { height: 3, duration: 0.3 });
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  return (
    <div className="music-player-container glass-panel" ref={playerRef}>
      {/* 
        Using a placeholder public domain audio. 
        In production, replace with a soft Holi festival track.
      */}
      <audio
        ref={audioRef}
        src={song}
        loop
      />

      <div className="controls-row">
        <button className="control-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause size={20} color="var(--color-purple)" /> : <Play size={20} color="var(--color-purple)" />}
        </button>

        <div className="visualizer" ref={visualizerRef}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className="volume-control">
          <button className="control-btn small" onClick={toggleMute} aria-label="Toggle Mute">
            {isMuted || volume === 0 ? <VolumeX size={16} color="var(--color-text)" /> : <Volume2 size={16} color="var(--color-text)" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
