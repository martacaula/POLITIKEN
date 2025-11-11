
import React, { useState } from 'react';
import { AGE_GROUPS, INTERESTS } from '../constants';
import type { UserSettings } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface SettingsPanelProps {
  onGenerate: (settings: UserSettings) => void;
  isLoading: boolean;
  onBack: () => void;
}

const CheckIcon = () => (
    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const DURATION_OPTIONS = [3, 5, 8, 10];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onGenerate, isLoading, onBack }) => {
  const { t } = useTranslations();
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(0);

  const ageGroupDetails = t('settings.ageGroupDetails', { returnObjects: true }) as { [key: string]: string };
  const interestOptions = t('settings.interests', { returnObjects: true }) as string[];
  const rawInterests = INTERESTS; // Keep original for state management

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };
  
  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setDuration(0);
    } else {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > 0) {
            setDuration(Math.min(numValue, 20)); // Cap at 20 minutes
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ageGroup && selectedInterests.length > 0 && duration > 0) {
      onGenerate({ ageGroup, interests: selectedInterests, duration });
    } else {
      alert(t('settings.alert'));
    }
  };

  return (
    <div className="text-center py-12 relative">
        <button onClick={onBack} className="absolute top-12 left-0 text-politiken-red font-bold hover:underline flex items-center gap-1 text-sm">
            <BackIcon />
            {t('settings.back_button')}
        </button>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-politiken-charcoal">{t('settings.title')}</h1>
        <p className="mt-4 text-lg text-gray-600">{t('settings.subtitle')}</p>
      
        <form onSubmit={handleSubmit} className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-serif mb-6">{t('settings.age_group_title')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {AGE_GROUPS.map(group => (
                    <button
                        type="button"
                        key={group}
                        onClick={() => setAgeGroup(group)}
                        className={`p-4 border text-left transition-all duration-200 relative ${ageGroup === group ? 'border-politiken-red ring-2 ring-politiken-red' : 'border-gray-300 hover:border-gray-500'}`}
                    >
                        {ageGroup === group && (
                           <div className="absolute -top-3 -right-3 bg-politiken-red h-6 w-6 flex items-center justify-center shadow">
                               <CheckIcon />
                           </div>
                        )}
                        <p className="font-bold">{group} {t('settings.years')}</p>
                        <p className="text-sm text-gray-600 mt-1">{ageGroupDetails[group]}</p>
                    </button>
                ))}
            </div>

            <h2 className="text-2xl font-bold font-serif mt-12 mb-6">{t('settings.interests_title')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
                 {rawInterests.map((interest, index) => (
                    <button
                        type="button"
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`py-2 px-5 text-sm font-medium border transition-colors duration-200 flex items-center gap-2 ${
                            selectedInterests.includes(interest)
                            ? 'bg-politiken-red text-white border-politiken-red'
                            : 'bg-white text-politiken-charcoal border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                         {selectedInterests.includes(interest) && <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        {interestOptions[index]}
                    </button>
                ))}
            </div>
            
            <h2 className="text-2xl font-bold font-serif mt-12 mb-6">{t('settings.duration_title')}</h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
                {DURATION_OPTIONS.map(d => (
                    <button
                        type="button"
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-3 px-8 border text-lg font-bold transition-all duration-200 ${duration === d ? 'border-politiken-red ring-2 ring-politiken-red text-politiken-red' : 'border-gray-300 hover:border-gray-500 text-politiken-charcoal'}`}
                    >
                        {d} {t('settings.min')}
                    </button>
                ))}
                <div className="relative">
                    <input
                        type="number"
                        min="1"
                        max="20"
                        placeholder={t('settings.custom_duration_placeholder')}
                        value={DURATION_OPTIONS.includes(duration) ? '' : (duration || '')}
                        onChange={handleCustomDurationChange}
                        className={`py-3 pl-4 pr-12 border text-lg font-bold w-40 text-center transition-all duration-200 appearance-none m-0 focus:outline-none bg-gray-50 text-politiken-charcoal ${!DURATION_OPTIONS.includes(duration) && duration > 0 ? 'border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}
                        style={{ MozAppearance: 'textfield' }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{t('settings.min')}</span>
                </div>
            </div>


            <div className="mt-12">
                <button
                    type="submit"
                    disabled={isLoading || !ageGroup || selectedInterests.length === 0 || duration === 0}
                    className="bg-politiken-red text-white font-bold py-3 px-12 text-lg hover:bg-opacity-90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? t('settings.generating_button') : t('settings.generate_button')}
                </button>
                 <p className="text-sm text-gray-500 mt-4">{t('settings.change_anytime')}</p>
            </div>
      </form>
    </div>
  );
};