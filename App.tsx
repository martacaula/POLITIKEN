
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
import { SavedEpisodesPanel } from './components/SavedEpisodesPanel';
import { useTranslations } from './hooks/useTranslations';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'settings' | 'player' | 'saved'>('landing');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [savedPodcasts, setSavedPodcasts] = useState<PodcastData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { language, t } = useTranslations();

  const handlePersonalizedGenerate = useCallback(async (settings: UserSettings) => {
    setIsLoading(true);
    setError(null);
    setPodcast(null);
    setUserSettings(settings);
    setView('player');

    try {
      const script = await summarizeNews(MOCK_ARTICLES, settings, language);
      const audioB64 = await generateSpeech(script);
      
      setPodcast({
        id: `podcast-${Date.now()}`,
        title: t('podcast.title_personalized'),
        script,
        audioB64,
        createdAt: Date.now(),
        settings: settings,
      });
    } catch (e) {
      console.error(e);
      setError(t('podcast.error_generate'));
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);
  
  const handleSavePodcast = (podcastToSave: PodcastData) => {
    if (!savedPodcasts.some(p => p.id === podcastToSave.id)) {
        setSavedPodcasts(prev => [podcastToSave, ...prev]);
    }
  };

  const handleViewSaved = () => {
    setView('saved');
  };
  
  const handlePlaySaved = (podcastToPlay: PodcastData) => {
    setPodcast(podcastToPlay);
    setUserSettings(podcastToPlay.settings);
    setView('player');
  };

  const handleCreateNew = () => {
    setPodcast(null);
    setUserSettings(null);
    setView('settings');
  }

  const handleBack = () => {
    // A more robust back function for different views
    if (view === 'saved') {
      setView('landing'); // Or wherever is appropriate
    } else {
      setView('landing');
    }
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
    setView('settings');
  };

  const handleStartChat = () => {
    setIsChatVisible(true);
  };

  return (
    <div className="bg-white text-politiken-charcoal">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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
              onSavePodcast={handleSavePodcast}
              onViewSaved={handleViewSaved}
              isSaved={podcast ? savedPodcasts.some(p => p.id === podcast.id) : false}
            />
        )}

        {view === 'saved' && (
            <SavedEpisodesPanel 
                podcasts={savedPodcasts}
                onPlay={handlePlaySaved}
                onBack={() => setView(isLoading ? 'player' : 'landing')}
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
        <p>{t('footer.text')}</p>
      </footer>
    </div>
  );
};

export default App;