
import React, { useState, useEffect, useRef } from 'react';
import type { PodcastData, UserSettings } from '../types';
import { useTranslations } from '../hooks/useTranslations';

// --- ICONS ---
const PlayIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);


const SkipBackIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

const SkipForwardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);

const VolumeIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 4a1 1 0 00-2 0v12a1 1 0 102 0V4zM13 4a1 1 0 00-2 0v12a1 1 0 102 0V4z" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const MicrophoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
        <path fillRule="evenodd" d="M10 18a7 7 0 007-7h-2a5 5 0 01-5 5 5 5 0 01-5-5H3a7 7 0 007 7z" clipRule="evenodd" />
    </svg>
);

const SaveIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SaveIconFilled: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 20 20" fill="currentColor">
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
);


// --- LOADING SPINNER ---
const LoadingSpinner: React.FC<{onViewSaved: () => void}> = ({onViewSaved}) => {
    const { t } = useTranslations();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-full">
            <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-semibold text-white">{t('player.loading_title')}</p>
            <p className="text-gray-400">{t('player.loading_subtitle')}</p>

            <div className="absolute bottom-6 left-0 right-0 text-center">
                <button onClick={onViewSaved} className="text-white/70 hover:text-white font-bold flex items-center gap-2 mx-auto bg-white/10 px-4 py-2 hover:bg-white/20 transition-colors">
                    <SaveIcon className="h-5 w-5"/>
                    <span>{t('player.view_saved_button')}</span>
                </button>
            </div>
        </div>
    );
};

// --- COMPONENT PROPS ---
interface PodcastPlayerProps {
  podcast: PodcastData | null;
  userSettings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  onCreateNew: () => void;
  onCancelGeneration: () => void;
  onStartChat: () => void;
  onBackToStart: () => void;
  onSavePodcast: (podcast: PodcastData) => void;
  onViewSaved: () => void;
  isSaved: boolean;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast, userSettings, isLoading, error, onCreateNew, onCancelGeneration, onStartChat, onBackToStart, onSavePodcast, onViewSaved, isSaved }) => {
    const { t } = useTranslations();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const virtualStartTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    // --- EFFECT: AUDIO SETUP & CLEANUP ---
    useEffect(() => {
        if (podcast?.audioB64) {
            const setupAudio = async () => {
                try {
                    if (audioContextRef.current?.state !== 'closed') {
                        audioContextRef.current?.close();
                    }
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

                    const audioBytes = decode(podcast.audioB64);
                    const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                    audioBufferRef.current = buffer;
                    setDuration(buffer.duration);
                    setProgress(0);
                    setIsPlaying(false);
                } catch (e) { console.error("Failed to decode audio", e); }
            };
            setupAudio();
        }
        return () => {
            sourceNodeRef.current?.stop();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [podcast]);
    
    // --- PLAYBACK LOGIC ---
    const updateProgress = () => {
        if (!audioContextRef.current) return;
        const newProgress = audioContextRef.current.currentTime - virtualStartTimeRef.current;
        setProgress(newProgress);

        if (newProgress < duration) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
            setProgress(duration);
            setIsPlaying(false);
        }
    };
    
    const handlePlayPause = () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;
         if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (isPlaying) {
            // Pause
            sourceNodeRef.current?.stop();
            cancelAnimationFrame(animationFrameRef.current);
            setIsPlaying(false);
        } else {
            // Play
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            sourceNodeRef.current = source;
            
            // If the track ended, reset progress
            const offset = progress >= duration ? 0 : progress;
            if (offset === 0) setProgress(0);

            source.start(0, offset);
            virtualStartTimeRef.current = audioContextRef.current.currentTime - offset;
            
            source.onended = () => {
                if (progress >= duration - 0.1) {
                    setIsPlaying(false);
                    setProgress(duration);
                }
                 cancelAnimationFrame(animationFrameRef.current);
            };

            setIsPlaying(true);
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!duration || !audioContextRef.current) return;
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      setProgress(seekTime);
       if (isPlaying) {
            sourceNodeRef.current?.stop();
            handlePlayPause();
        }
    };

    const handleStartChatClick = () => {
        if (isPlaying) {
            handlePlayPause();
        }
        onStartChat();
    };
    
    // --- HELPERS ---
    const formatTime = (time: number) => {
        if (isNaN(time) || time < 0) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

    // --- RENDER LOGIC ---
    if (isLoading) {
        return (
            <div className="bg-politiken-charcoal text-white p-6 min-h-[400px] flex items-center justify-center relative">
                 <button onClick={onCancelGeneration} className="absolute top-4 left-4 text-white/70 hover:text-white font-bold flex items-center gap-1 text-sm z-10">
                    <BackIcon />
                    {t('player.back_button')}
                </button>
                <LoadingSpinner onViewSaved={onViewSaved} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 p-6 text-red-700 text-center">
                <h3 className="font-bold text-lg mb-2">{t('player.error_title')}</h3>
                <p>{error}</p>
                 <button onClick={onCreateNew} className="mt-4 bg-politiken-red text-white font-bold py-2 px-6 hover:bg-opacity-90 transition-colors duration-200">
                    {t('player.try_again_button')}
                </button>
            </div>
        );
    }
    
    if (!podcast || !userSettings) {
        return null; // Or some placeholder
    }

    return (
        <div className="relative">
            <button onClick={onBackToStart} className="absolute top-0 left-0 text-politiken-red font-bold hover:underline flex items-center gap-1 text-sm">
                <BackIcon />
                {t('player.back_to_start_button')}
            </button>
            <div className="text-center mb-8 pt-8">
                 <h2 className="font-serif text-3xl md:text-4xl font-bold text-politiken-charcoal">{t('player.todays_episode_title')}</h2>
                 <p className="mt-2 text-lg text-gray-600">{t('player.todays_episode_subtitle')}</p>
            </div>
            <div className="bg-politiken-charcoal text-white p-6 md:p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <button onClick={handlePlayPause} className="flex-shrink-0 bg-white/20 hover:bg-white/30 p-3 mt-1">
                            {isPlaying ? <PauseIcon className="h-7 w-7 text-white" /> : <PlayIcon className="h-7 w-7 text-white" />}
                        </button>
                        <div>
                            <h3 className="text-xl font-bold font-serif">{podcast.title}</h3>
                            <p className="text-sm text-gray-300">{userSettings.interests.join(' • ')} • {Math.round(duration/60)} {t('player.minutes')}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {userSettings.interests.map(interest => (
                                    <span key={interest} className="text-xs font-medium bg-white/10 text-white px-2 py-1">{interest}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                     <button 
                        onClick={() => !isSaved && onSavePodcast(podcast)} 
                        title={isSaved ? t('player.episode_saved_tooltip') : t('player.save_episode_tooltip')}
                        className={`group flex items-center gap-2 flex-shrink-0 p-2 transition-colors ${isSaved ? 'text-politiken-red' : 'text-gray-400 hover:text-white'}`}
                        disabled={isSaved}
                    >
                        <span className={`text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isSaved && 'opacity-100'}`}>
                            {isSaved ? t('player.saved_button') : t('player.save_button')}
                        </span>
                        {isSaved ? <SaveIconFilled className="h-6 w-6"/> : <SaveIcon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="my-6">
                    <input type="range" min="0" max="100" value={progressPercentage} onChange={handleSeek} className="w-full h-2 bg-white/20 appearance-none cursor-pointer accent-politiken-red" />
                    <div className="flex justify-between text-xs font-mono text-gray-400 mt-1">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="w-1/3">
                        <div className="flex items-center gap-2 w-32">
                            <VolumeIcon />
                            <input type="range" className="w-full h-1 bg-white/20 appearance-none cursor-pointer accent-politiken-red" />
                        </div>
                    </div>
                    <div className="w-1/3 flex justify-center items-center gap-6">
                        <button className="text-gray-300 hover:text-white"><SkipBackIcon /></button>
                        <button onClick={handlePlayPause} className="bg-politiken-red text-white p-3 shadow-lg">
                            {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                        </button>
                        <button className="text-gray-300 hover:text-white"><SkipForwardIcon /></button>
                    </div>
                    <div className="w-1/3 flex justify-end">
                       <button onClick={handleStartChatClick} title={t('player.ask_tooltip')} className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10">
                            <MicrophoneIcon />
                        </button>
                    </div>
                </div>
            </div>
            <div className="text-center mt-6">
                 <button onClick={onCreateNew} className="text-politiken-red font-bold hover:underline">
                    {t('player.create_new_button')}
                </button>
            </div>
        </div>
    );
};

// --- UTILITY IMPLEMENTATIONS ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}