
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);


export const Header: React.FC = () => {
  const { t, language, setLanguage } = useTranslations();
  const navItems = t('header.navItems', { returnObjects: true }) as string[];

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <img src="/plogtop.00.09.png" alt="Politiken Logo" className="h-12 md:h-16 mx-auto" />
      </div>
      <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-between items-center h-12">
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <a key={item} href="#" className="text-sm font-bold tracking-wider hover:text-politiken-red transition-colors">{item}</a>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm font-bold flex items-center">
                        <button 
                            onClick={() => setLanguage('en')}
                            className={`px-2 transition-colors ${language === 'en' ? 'text-politiken-charcoal font-extrabold' : 'text-gray-400 hover:text-politiken-red'}`}>
                            EN
                        </button>
                        <span className="text-gray-300">|</span>
                        <button 
                            onClick={() => setLanguage('da')}
                            className={`px-2 transition-colors ${language === 'da' ? 'text-politiken-charcoal font-extrabold' : 'text-gray-400 hover:text-politiken-red'}`}>
                            DA
                        </button>
                    </div>
                    <div className="h-5 w-px bg-gray-200"></div>
                    <button className="flex items-center space-x-1 font-bold text-sm">
                        <SearchIcon />
                        <span>{t('header.search')}</span>
                    </button>
                    <button className="flex items-center space-x-1 font-bold text-sm">
                        <MenuIcon />
                        <span>{t('header.menu')}</span>
                    </button>
                </div>
            </nav>
        </div>
      </div>
    </header>
  );
};