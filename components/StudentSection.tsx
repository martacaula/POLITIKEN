
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-politiken-charcoal" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const StudentSection: React.FC = () => {
    const { t } = useTranslations();
    const benefits = t('student.benefits', { returnObjects: true }) as string[];
    const partners = t('student.partners', { returnObjects: true }) as string[];

    return (
        <section className="py-16 md:py-24 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-sm font-bold bg-politiken-red/10 text-politiken-red px-3 py-1">{t('student.tag')}</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mt-4">{t('student.title')}</h2>
                        <p className="mt-4 text-gray-600">{t('student.description')}</p>
                        <ul className="mt-6 space-y-3">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircleIcon />
                                    <span className="ml-3 text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 bg-politiken-red text-white font-bold py-3 px-6 text-base hover:bg-opacity-90 transition-colors duration-200">
                           {t('student.verify_button')}
                        </button>
                    </div>
                    <div className="border border-gray-200 p-8 bg-white">
                        <div className="bg-politiken-red h-16 w-16 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="font-serif text-2xl font-bold mt-6">{t('student.card_title')}</h3>
                        <p className="mt-2 text-gray-600">{t('student.card_description')}</p>
                        <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex justify-between items-baseline">
                                <p>{t('student.student_union_label')}</p>
                                <p className="font-bold text-xl text-green-600">{t('student.free_label')}</p>
                            </div>
                             <div className="flex justify-between items-baseline">
                                <p>{t('student.after_grad_label')}</p>
                                <p className="font-bold text-xl">{t('student.price')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-gray-200 pt-12">
                    <h3 className="text-center text-lg font-bold uppercase tracking-wider text-gray-500 mb-8">
                       {t('student.partners_title')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 items-center">
                        {partners.map(partner => (
                            <div key={partner} className="text-center">
                                <p className="text-gray-500 font-semibold text-base grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-300">
                                    {partner}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};