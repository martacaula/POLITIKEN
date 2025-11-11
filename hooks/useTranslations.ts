
import { useContext } from 'react';
import { LanguageContext } from '../lib/i18n';

export const useTranslations = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslations must be used within a LanguageProvider');
    }
    return context;
};
