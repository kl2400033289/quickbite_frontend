import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEffects';

interface AudioContextType {
  isSoundEnabled: boolean;
  isAmbientPlaying: boolean;
  toggleSound: () => void;
  toggleAmbient: () => void;
  playAddToCart: () => void;
  playKitchenBell: () => void;
  playOrderSuccess: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('quickbite_sound_enabled') !== 'false';
  });
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.setMuted(!isSoundEnabled);
    localStorage.setItem('quickbite_sound_enabled', String(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.setMuted(!next);
      if (next) {
        soundEngine.playAddToCart(); // give immediate auditory confirmation
      }
      return next;
    });
  };

  const toggleAmbient = () => {
    const isPlaying = soundEngine.toggleAmbientSound();
    setIsAmbientPlaying(isPlaying);
  };

  const playAddToCart = () => {
    if (isSoundEnabled) soundEngine.playAddToCart();
  };

  const playKitchenBell = () => {
    if (isSoundEnabled) soundEngine.playKitchenBell();
  };

  const playOrderSuccess = () => {
    if (isSoundEnabled) soundEngine.playOrderSuccess();
  };

  return (
    <AudioContext.Provider
      value={{
        isSoundEnabled,
        isAmbientPlaying,
        toggleSound,
        toggleAmbient,
        playAddToCart,
        playKitchenBell,
        playOrderSuccess,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
