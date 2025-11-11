
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SettingsPanel } from './components/SettingsPanel';
import { PodcastPlayer } from './components/PodcastPlayer';
import { FeaturesSection } from './components/FeaturesSection';
import { StudentSection } from './components/StudentSection';
import { summarizeNews, generateSpeech } from './services/geminiService';
import type { UserSettings, PodcastData } from './types';
import { MOCK_ARTICLES } from './constants';
import { VoiceChatOverlay } from './components/VoiceChatOverlay';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'settings' | 'player'>('landing');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const handlePersonalizedGenerate = useCallback(async (settings: UserSettings) => {
    setIsLoading(true);
    setError(null);
    setPodcast(null);
    setUserSettings(settings);
    setView('player');

    try {
      const script = await summarizeNews(MOCK_ARTICLES, settings);
      const audioB64 = await generateSpeech(script);
      
      setPodcast({
        title: `Your Personalized Briefing`,
        script,
        audioB64,
      });
    } catch (e) {
      console.error(e);
      setError('Failed to generate your podcast. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreateNew = () => {
    setPodcast(null);
    setUserSettings(null);
    setView('settings');
  }

  const handleBack = () => {
    setView('landing');
  }

  const handleBackToStart = () => {
    setView('landing');
  };

  const handleCancelGeneration = () => {
    setIsLoading(false);
    setView('settings');
  };

  const handleStartListening = () => {
    if (podcast) {
      setView('player');
      return;
    }
    
    const defaultSettings = { ageGroup: '30-40', interests: ['Politics', 'Culture'] };
    
    // Set up loading state
    setIsLoading(true);
    setError(null);
    setPodcast(null);
    setUserSettings(defaultSettings);
    setView('player'); 

    // FIX: Pass `script` through the promise chain so it's available when creating the podcast object.
    const generationPromise = summarizeNews(MOCK_ARTICLES, defaultSettings)
      .then(script => generateSpeech(script).then(audioB64 => ({
        title: `Tuesday Morning Briefing`,
        script,
        audioB64,
      })));
      
    const timerPromise = new Promise(resolve => setTimeout(resolve, 4000));
    
    Promise.all([generationPromise, timerPromise])
      .then(([generatedPodcast]) => {
        setPodcast(generatedPodcast as PodcastData);
      })
      .catch(e => {
        console.error(e);
        setError('Failed to generate your podcast. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStartChat = () => {
    setIsChatVisible(true);
  };

  return (
    <div className="bg-white text-politiken-charcoal">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {view === 'landing' && (
          <>
            <HeroSection onStartListening={handleStartListening} />
            <FeaturesSection />
            <StudentSection />
          </>
        )}

        {view === 'settings' && (
          <SettingsPanel onGenerate={handlePersonalizedGenerate} isLoading={isLoading} onBack={handleBack} />
        )}
        
        {view === 'player' && (
           <PodcastPlayer 
              podcast={podcast} 
              userSettings={userSettings}
              isLoading={isLoading} 
              error={error}
              onCreateNew={handleCreateNew} 
              onCancelGeneration={handleCancelGeneration}
              onStartChat={handleStartChat}
              onBackToStart={handleBackToStart}
            />
        )}
      </main>
      {isChatVisible && podcast && (
        <VoiceChatOverlay 
          onClose={() => setIsChatVisible(false)}
          podcastContext={podcast.script}
        />
      )}
      <footer className="text-center text-gray-500 py-8 text-sm border-t border-gray-200">
        <p>Politiken Re:Connect — Habit today, loyalty tomorrow.</p>
      </footer>
    </div>
  );
};

export default App;
