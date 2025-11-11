
import React from 'react';
import type { PodcastData } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface SavedEpisodesPanelProps {
  podcasts: PodcastData[];
  onPlay: (podcast: PodcastData) => void;
  onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);


export const SavedEpisodesPanel: React.FC<SavedEpisodesPanelProps> = ({ podcasts, onPlay, onBack }) => {
  const { t, language } = useTranslations();
  
  const formatDate = (timestamp: number) => {
    const locale = language === 'da' ? 'da-DK' : 'en-US';
    return new Date(timestamp).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="py-12 relative">
      <button onClick={onBack} className="absolute top-12 left-0 text-politiken-red font-bold hover:underline flex items-center gap-1 text-sm">
        <BackIcon />
        {t('saved.back_button')}
      </button>
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-politiken-charcoal">{t('saved.title')}</h1>
        <p className="mt-4 text-lg text-gray-600">{t('saved.subtitle')}</p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {podcasts.length === 0 ? (
          <div className="text-center border border-gray-200 p-12 bg-gray-50">
            <p className="text-gray-500">{t('saved.empty_title')}</p>
            <p className="text-sm text-gray-400 mt-2">{t('saved.empty_subtitle')}</p>
          </div>
        ) : (
          podcasts.map(podcast => (
            <div key={podcast.id} className="border border-gray-200 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">{podcast.title}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(podcast.createdAt)} • {podcast.settings.interests.join(', ')} • {podcast.settings.duration} {t('saved.min')}
                </p>
              </div>
              <button
                onClick={() => onPlay(podcast)}
                className="bg-politiken-red text-white p-3 hover:bg-opacity-90 transition-colors flex-shrink-0"
              >
                <PlayIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};