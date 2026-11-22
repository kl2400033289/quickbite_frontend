import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface CinematicVideoProps {
  videoSrc?: string;
  posterSrc: string;
  altText: string;
  className?: string;
  aspectRatio?: string;
  overlayGradient?: boolean;
  showVolumeControl?: boolean;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  videoSrc,
  posterSrc,
  altText,
  className = '',
  overlayGradient = true,
  showVolumeControl = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Poster Image Fallback (Always rendered as base layer) */}
      <img
        src={posterSrc}
        alt={altText}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Video element - only if videoSrc is provided and has not errored */}
      {videoSrc && !hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Cinematic dark subtle overlay gradient */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent pointer-events-none" />
      )}

      {/* Video Unmute / Mute Button if video is active */}
      {videoSrc && !hasError && isVideoLoaded && showVolumeControl && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-charcoal-950/70 hover:bg-charcoal-950 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 text-xs shadow-lg active:scale-95"
          title={isMuted ? 'Click to enable audio' : 'Click to mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-warm-300" />
              <span className="hidden sm:inline text-[11px] font-medium">Unmute Video</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-tangerine-400" />
              <span className="hidden sm:inline text-[11px] font-medium text-tangerine-400">Audio Playing</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
