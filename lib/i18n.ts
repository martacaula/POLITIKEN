
import React, { createContext, useState, ReactNode, useMemo } from 'react';
import i18next from 'i18next';

type Language = 'en' | 'da';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    // Fix: Changed return type to 'any' to allow for returning objects and arrays for structured translation content.
    t: (key: string, options?: any) => any;
}

export const translations = {
    en: {
        translation: {
            header: {
                navItems: ['LATEST NEWS', 'DENMARK', 'CULTURE', 'DEBATE', 'CLIMATE', 'INTERNATIONAL', 'SPORT', 'FOOD', 'IBYEN', 'PODCAST'],
                search: 'SEARCH',
                menu: 'MENU',
            },
            hero: {
                tag: 'AI-Powered Daily News',
                title: 'Politiken Re:Connect',
                description: 'Your daily dose of quality journalism, curated and summarized by AI. Up to 20 minutes of the stories that matter, tailored to your interests.',
                button: 'Start Listening',
                stat1_title: 'Up to 20 min',
                stat1_desc: 'Daily episodes',
                stat2_title: '5+ topics',
                stat2_desc: 'Customizable',
                stat3_title: 'Free*',
                stat3_desc: 'For students',
                episode_title: "Today's Episode",
                episode_desc: '8 min • Politics & Culture',
            },
            features: {
                list: [
                    { title: 'AI-Powered Curation', description: 'Our AI analyzes Politiken’s long-form journalism and creates concise, engaging summaries without losing the depth.' },
                    { title: 'Up to 20 Minute Episodes', description: 'Perfect for your morning routine, commute, or coffee break. Get informed without the time commitment.' },
                    { title: 'Smart Notifications', description: 'Receive your daily episode at natural moments - when your alarm rings or during your usual listening time.' },
                    { title: 'Personalized Content', description: 'Tailored by age group and interests, ensuring you get the news that matters most to you.' },
                ],
            },
            student: {
                tag: 'Student Program',
                title: 'Free Access Through Your Student Union',
                description: 'We believe quality journalism should be accessible to everyone. That’s why we partner with student unions across Denmark to offer free, unlimited access to Politiken Re:Connect throughout your university years.',
                benefits: [
                    'Full access to all AI-powered daily episodes',
                    'Personalized content based on your interests',
                    'No commitment - free throughout your studies',
                    'Early access to new features',
                    'Seamless transition to paid subscription after graduation',
                ],
                verify_button: 'Verify Student Status',
                card_title: 'Build the Habit Today',
                card_description: 'Experience premium journalism quality for free. When you graduate, you\'ll already trust Politiken and understand its value.',
                student_union_label: 'Student Union',
                free_label: 'Free*',
                after_grad_label: 'After graduation',
                price: '339 dkk month',
                partners_title: 'Our Partners',
                partners: [
                    'Student Council at University of Copenhagen',
                    'The Student Council at Aarhus University',
                    'Syddansk Studerende (SDU)',
                    'Studentersamfundet (DTU)',
                ],
            },
            settings: {
                back_button: 'Back',
                title: 'Personalized for You',
                subtitle: 'Choose your age group and interests to get content that matters most to you',
                age_group_title: 'Select Your Age Group',
                years: 'years',
                ageGroupDetails: {
                    '20-30': 'Fresh perspectives & emerging trends',
                    '30-40': 'Career & lifestyle focus',
                    '40-50': 'In-depth analysis & insights',
                    '50-60': 'Comprehensive coverage',
                    '60+': 'Classic journalism & depth',
                },
                interests_title: 'Choose Your Interests',
                interests: ['Politics', 'Culture', 'Sports', 'Finance', 'Technology', 'World News'],
                duration_title: 'Select Briefing Length',
                min: 'min',
                custom_duration_placeholder: 'Custom',
                generate_button: 'Generate My Podcast',
                generating_button: 'Generating...',
                change_anytime: 'You can change your preferences anytime',
                alert: 'Please select an age group, at least one interest, and a briefing duration.',
            },
            player: {
                back_button: 'Back',
                loading_title: 'Crafting Your Podcast...',
                loading_subtitle: 'This will take just a few seconds...',
                view_saved_button: 'View Saved Episodes',
                error_title: 'An Error Occurred',
                try_again_button: 'Try Again',
                back_to_start_button: 'Back to Start',
                todays_episode_title: "Today's Episode",
                todays_episode_subtitle: 'Your personalized news summary is ready',
                minutes: 'minutes',
                save_button: 'Save',
                saved_button: 'Saved',
                save_episode_tooltip: 'Save Episode',
                episode_saved_tooltip: 'Episode Saved',
                ask_tooltip: 'Ask about this story',
                create_new_button: 'Create new personalized podcast',
            },
            saved: {
                back_button: 'Back',
                title: 'Saved Episodes',
                subtitle: 'Listen to your previously generated briefings.',
                empty_title: "You haven't saved any episodes yet.",
                empty_subtitle: 'Generate a podcast and click the save icon to find it here later.',
                min: 'min',
            },
            voice_chat: {
                title: 'Voice Assistant',
                subtitle: 'Ask for more details about the news.',
                initial_prompt: 'You can ask questions like "Tell me more about the first story" or "What does this mean for me?"',
                status_connecting: 'Connecting...',
                status_listening: 'Listening...',
                status_speaking: 'Speaking...',
                status_error: 'Connection Error',
                system_instruction: 'You are a helpful assistant for Politiken Re:Connect. The user is currently listening to a podcast with the following script: "{{context}}". Answer their questions based on this context, providing more detail where possible. Be concise and conversational. Speak English.',
            },
            podcast: {
                title_personalized: 'Your Personalized Briefing',
                error_generate: 'Failed to generate your podcast. Please try again.',
            },
            footer: {
                text: 'Politiken Re:Connect — Habit today, loyalty tomorrow.',
            },
        }
    },
    da: {
        translation: {
            header: {
                navItems: ['SENESTE NYT', 'DANMARK', 'KULTUR', 'DEBAT', 'KLIMA', 'INTERNATIONALT', 'SPORT', 'MAD', 'IBYEN', 'PODCAST'],
                search: 'SØG',
                menu: 'MENU',
            },
            hero: {
                tag: 'AI-drevet Daglige Nyheder',
                title: 'Politiken Re:Connect',
                description: 'Din daglige dosis kvalitetsjournalistik, kurateret og opsummeret af AI. Op til 20 minutter med de historier, der betyder noget, skræddersyet til dine interesser.',
                button: 'Start Lytning',
                stat1_title: 'Op til 20 min',
                stat1_desc: 'Daglige episoder',
                stat2_title: '5+ emner',
                stat2_desc: 'Kan tilpasses',
                stat3_title: 'Gratis*',
                stat3_desc: 'For studerende',
                episode_title: "Dagens Episode",
                episode_desc: '8 min • Politik & Kultur',
            },
            features: {
                list: [
                    { title: 'AI-drevet Kuratering', description: 'Vores AI analyserer Politikens dybdegående journalistik og skaber præcise, engagerende opsummeringer uden at miste dybden.' },
                    { title: 'Op til 20 Minutters Episoder', description: 'Perfekt til din morgenrutine, pendling eller kaffepause. Bliv informeret uden den store tidsinvestering.' },
                    { title: 'Smarte Notifikationer', description: 'Modtag din daglige episode på naturlige tidspunkter - når dit vækkeur ringer eller i løbet af din sædvanlige lyttetid.' },
                    { title: 'Personligt Indhold', description: 'Skræddersyet efter aldersgruppe og interesser, så du får de nyheder, der betyder mest for dig.' },
                ],
            },
            student: {
                tag: 'Studieprogram',
                title: 'Gratis Adgang Gennem Din Studieforening',
                description: 'Vi mener, at kvalitetsjournalistik skal være tilgængelig for alle. Derfor samarbejder vi med studieforeninger i hele Danmark for at tilbyde gratis, ubegrænset adgang til Politiken Re:Connect under hele din studietid.',
                benefits: [
                    'Fuld adgang til alle AI-drevne daglige episoder',
                    'Personligt indhold baseret på dine interesser',
                    'Ingen binding - gratis under hele dit studie',
                    'Tidlig adgang til nye funktioner',
                    'Problemfri overgang til betalt abonnement efter endt uddannelse',
                ],
                verify_button: 'Verificér Studiestatus',
                card_title: 'Opbyg Vanen I Dag',
                card_description: 'Oplev journalistik i topkvalitet gratis. Når du er færdiguddannet, vil du allerede have tillid til Politiken og forstå dens værdi.',
                student_union_label: 'Student Union',
                free_label: 'Gratis*',
                after_grad_label: 'Efter uddannelse',
                price: '339 kr. md.',
                partners_title: 'Vores Partnere',
                partners: [
                    'Studenterrådet ved Københavns Universitet',
                    'De Studerendes Råd på Aarhus Universitet',
                    'Syddansk Studerende (SDU)',
                    'Studentersamfundet (DTU)',
                ],
            },
            settings: {
                back_button: 'Tilbage',
                title: 'Personliggjort til Dig',
                subtitle: 'Vælg din aldersgruppe og interesser for at få indhold, der betyder mest for dig',
                age_group_title: 'Vælg Din Aldersgruppe',
                years: 'år',
                ageGroupDetails: {
                    '20-30': 'Friske perspektiver & nye trends',
                    '30-40': 'Fokus på karriere & livsstil',
                    '40-50': 'Dybdegående analyser & indsigt',
                    '50-60': 'Omfattende dækning',
                    '60+': 'Klassisk journalistik & dybde',
                },
                interests_title: 'Vælg Dine Interesser',
                interests: ['Politik', 'Kultur', 'Sport', 'Økonomi', 'Teknologi', 'Verdensnyt'],
                duration_title: 'Vælg Briefing Længde',
                min: 'min',
                custom_duration_placeholder: 'Andet',
                generate_button: 'Generer Min Podcast',
                generating_button: 'Genererer...',
                change_anytime: 'Du kan altid ændre dine præferencer',
                alert: 'Vælg venligst en aldersgruppe, mindst én interesse og en briefing-længde.',
            },
             player: {
                back_button: 'Tilbage',
                loading_title: 'Forbereder din podcast...',
                loading_subtitle: 'Dette tager kun et øjeblik...',
                view_saved_button: 'Se Gemte Episoder',
                error_title: 'Der opstod en fejl',
                try_again_button: 'Prøv Igen',
                back_to_start_button: 'Tilbage til Start',
                todays_episode_title: "Dagens Episode",
                todays_episode_subtitle: 'Din personlige nyhedsoversigt er klar',
                minutes: 'minutter',
                save_button: 'Gem',
                saved_button: 'Gemt',
                save_episode_tooltip: 'Gem Episode',
                episode_saved_tooltip: 'Episode Gemt',
                ask_tooltip: 'Spørg om denne historie',
                create_new_button: 'Opret ny personlig podcast',
            },
            saved: {
                back_button: 'Tilbage',
                title: 'Gemte Episoder',
                subtitle: 'Lyt til dine tidligere genererede briefinger.',
                empty_title: 'Du har ikke gemt nogen episoder endnu.',
                empty_subtitle: 'Generer en podcast og klik på gem-ikonet for at finde den her senere.',
                min: 'min',
            },
            voice_chat: {
                title: 'Stemmeassistent',
                subtitle: 'Spørg for flere detaljer om nyhederne.',
                initial_prompt: 'Du kan stille spørgsmål som "Fortæl mig mere om den første historie" eller "Hvad betyder det for mig?"',
                status_connecting: 'Forbinder...',
                status_listening: 'Lytter...',
                status_speaking: 'Taler...',
                status_error: 'Forbindelsesfejl',
                system_instruction: 'Du er en hjælpsom assistent for Politiken Re:Connect. Brugeren lytter i øjeblikket til en podcast med følgende manuskript: "{{context}}". Besvar deres spørgsmål baseret på denne kontekst og giv flere detaljer, hvor det er muligt. Vær kortfattet og samtaleagtig. Tal dansk.',
            },
            podcast: {
                title_personalized: 'Din Personlige Briefing',
                error_generate: 'Kunne ikke generere din podcast. Prøv venligst igen.',
            },
            footer: {
                text: 'Politiken Re:Connect — Vane i dag, loyalitet i morgen.',
            },
        }
    }
};

i18next.init({
    resources: translations,
    lng: 'da',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('da');

    const setLanguage = (lang: Language) => {
        i18next.changeLanguage(lang);
        setLanguageState(lang);
    };
    
    const t = useMemo(() => (key: string, options?: any) => i18next.t(key, options), [language]);

    // Fix: Replaced JSX with React.createElement to avoid parsing issues in a .ts file.
    return React.createElement(
        LanguageContext.Provider,
        { value: { language, setLanguage, t } },
        children
    );
};
