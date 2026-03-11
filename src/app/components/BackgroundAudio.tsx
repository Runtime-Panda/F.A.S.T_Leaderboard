import React, { useState, useEffect, useRef } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

export function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Many modern browsers require a user interaction to autoplay audio, 
      // but we will attempt it here anyway.
      audioRef.current.play().catch(err => {
        console.warn("Autoplay was blocked by browser:", err);
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // If volume is 0 and we hit play, set it back to default or a low level
        if (audioRef.current.volume === 0) {
          const defaultVolume = 0.3;
          audioRef.current.volume = defaultVolume;
          setVolume(defaultVolume);
        }
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && !isPlaying) {
        setIsPlaying(true);
        audioRef.current.play().catch(console.error);
      } else if (newVolume === 0 && isPlaying) {
        setIsPlaying(false);
        audioRef.current.pause();
      }
    }
  };

  // Select appropriate icon
  const VolumeIcon = volume === 0 || !isPlaying ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // Track progress visually
  const currentVolumePercentage = (isPlaying ? volume : 0) * 100;

  return (
    <div 
      className="flex items-center justify-center relative z-50 group bg-[#111111]/80 hover:bg-[#222222]/80 backdrop-blur-sm transition-colors rounded-xl px-1 py-1 pr-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio ref={audioRef} src="/bgm.mp3" loop autoPlay />

      <button
        onClick={togglePlay}
        className={`p-1.5 transition-colors rounded-lg focus:outline-none focus:ring-2 shrink-0 ${
          isPlaying && volume > 0 
            ? 'text-[#A1A1AA] hover:text-[#76B900] focus:ring-[#76B900]/50' 
            : 'text-[#A1A1AA] hover:text-white focus:ring-white/50'
        }`}
        title={isPlaying ? "Pause Background Music" : "Play Background Music"}
        aria-label="Toggle Background Music"
      >
        <VolumeIcon size={20} />
      </button>
      
      <div 
        className={`overflow-hidden transition-[width,margin,opacity] duration-300 ease-in-out flex items-center ${
          isHovered ? 'w-24 ml-2 opacity-100' : 'w-0 ml-0 opacity-0'
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isPlaying ? volume : 0}
          onChange={handleVolumeChange}
          className={`w-full h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all ${
            isPlaying && volume > 0 ? '[&::-webkit-slider-thumb]:bg-[#76B900]' : '[&::-webkit-slider-thumb]:bg-[#666666]'
          }`}
          style={{
            background: `linear-gradient(to right, #76B900 ${currentVolumePercentage}%, #333333 ${currentVolumePercentage}%)`
          }}
        />
      </div>
    </div>
  );
}
