import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface HeroSectionProps {
    onStartListening: () => void;
}

const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartListening }) => {
    const { t } = useTranslations();

    return (
        <section className="flex flex-col items-start text-left py-12">
            {/* Text Content */}
            <span className="inline-block bg-politiken-red/10 text-politiken-red text-sm font-bold px-3 py-1">
                {t('hero.tag')}
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-extrabold text-politiken-charcoal mt-4 max-w-4xl">
                {t('hero.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                {t('hero.description')}
            </p>
            <button 
                onClick={onStartListening}
                className="mt-8 bg-politiken-red text-white font-bold py-3 px-8 text-lg hover:bg-opacity-90 transition-colors duration-200 inline-flex items-center gap-2"
            >
                <PlayIcon />
                {t('hero.button')}
            </button>
            <div className="mt-8 flex justify-start space-x-8 text-politiken-charcoal">
                <div>
                    <p className="font-bold text-lg">{t('hero.stat1_title')}</p>
                    <p className="text-sm text-gray-500">{t('hero.stat1_desc')}</p>
                </div>
                    <div>
                    <p className="font-bold text-lg">{t('hero.stat2_title')}</p>
                    <p className="text-sm text-gray-500">{t('hero.stat2_desc')}</p>
                </div>
                    <div>
                    <p className="font-bold text-lg text-green-600">{t('hero.stat3_title')}</p>
                    <p className="text-sm text-gray-500">{t('hero.stat3_desc')}</p>
                </div>
            </div>
        </section>
    );
}