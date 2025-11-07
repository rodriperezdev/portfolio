'use client';

import { useState, useEffect } from 'react';

export type Language = 'en' | 'es';

export function useLanguage() {
  // Default to Spanish
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);
    
    // Check localStorage first
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    } else {
      // Default to Spanish if no saved preference
      setLanguage('es');
      localStorage.setItem('language', 'es');
    }
  }, []);
  
  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  const setLanguageValue = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Return default language until mounted to prevent hydration mismatch
  return { language: mounted ? language : 'es', toggleLanguage, setLanguage: setLanguageValue };
}

