'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
import { getApiUrl } from '@/lib/api-config';

// Import data
import { 
  presidentialTerms, 
  economicEvents, 
  indecManipulationPeriod, 
  deflationPeriod 
} from '@/data/argentina-data';
import { translations, Language } from '@/data/translations';

// Import components
import { PriceConverter } from '@/components/inflation/PriceConverter';
import { InflationChart } from '@/components/inflation/InflationChart';
import { DataQualityNotice } from '@/components/inflation/DataQualityNotice';
import { CurrentStats } from '@/components/inflation/CurrentStats';

// Import hooks
import { useInflationData } from '@/hooks/useInflationData';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

// Get API URL from centralized config
const API_BASE_URL = getApiUrl('inflation');

export default function InflationTrackerPage() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { inflationData, currentStats, loading, error } = useInflationData(API_BASE_URL);
  
  const t = translations[language];
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[rgb(var(--foreground))] opacity-20 mx-auto mb-4"></div>
          <p className="text-[rgb(var(--foreground))] text-xl opacity-70">{t.loading}</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
        <div className="border border-[rgb(var(--foreground))]/10 bg-[rgb(var(--card))] rounded-2xl p-8 max-w-md shadow-lg">
          <h2 className="text-[rgb(var(--foreground))] text-2xl font-bold mb-4">⚠️ {t.error}</h2>
          <p className="text-[rgb(var(--foreground))] opacity-70 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
          >
            {t.retry}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] relative overflow-hidden">
      {/* Curved Background SVG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <path d="M0,400 Q360,300 720,400 T1440,400 L1440,0 L0,0 Z" fill="rgb(var(--accent))" opacity="0.3"/>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[rgb(var(--foreground))]/10 bg-[rgb(var(--background))]/80 backdrop-blur-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm hover:opacity-70 transition">
            <ArrowLeft size={18} />
            {t.backToPortfolio}
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4 transition-transform duration-200" /> : <Sun className="h-4 w-4 transition-transform duration-200" />}
            </Button>
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
        {/* Title Section */}
        <div className="mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mb-4 sm:mb-6" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.6 }}>
            {t.subtitle}
          </p>
          <div className="flex gap-2 flex-wrap mb-4 sm:mb-6">
            {['Python', 'FastAPI', 'FRED API', 'SQLAlchemy', 'Next.js', 'Recharts'].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 border border-[rgb(var(--foreground))]/20 rounded-full text-xs sm:text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button size="lg" className="border-black text-sm sm:text-base min-h-[44px] w-full sm:w-auto cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg group" asChild>
              <a href="https://github.com/rodriperezdev/inflation-tracker-backend" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Github className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                {t.viewCode}
              </a>
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 md:p-8 bg-[rgb(var(--card))] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>{t.overview}</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.7 }}>{t.overviewText}</p>
          
          {/* Data Sources & Methodology */}
          <div className="pt-6 mt-6 border-t border-[rgb(var(--foreground))]/10">
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.9 }}>{t.dataSourcesTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.7 }}>{t.dataSourcesText}</p>
          </div>
        </div>

        {/* Data Quality Notice */}
        <DataQualityNotice translations={t} />

        {/* Price Converter */}
        <PriceConverter
          apiUrl={API_BASE_URL}
          language={language}
          theme={theme}
          translations={t}
        />

        {/* Current Stats */}
        <CurrentStats
          stats={currentStats}
          language={language}
          translations={t}
        />

        {/* Inflation Chart */}
        <InflationChart
          data={inflationData}
          language={language}
          theme={theme}
          translations={t}
          loading={loading}
        />
      </div>

      {/* Footer */}
      <footer className="relative py-8 border-t border-black mt-12" style={{ backgroundColor: `rgb(var(--accent))` }}>
        <div className="container mx-auto px-6">
          <div
            className="flex flex-col items-center justify-between gap-4 text-center text-sm md:flex-row md:text-left"
            style={{ color: `rgb(var(--muted-foreground))` }}
          >
            <p style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>
              © 2025 Rodrigo Pérez. {language === 'en' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
            </p>
            <p style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>
              {language === 'en' 
                ? 'If you have any questions or ideas for any of my projects feel free to contact me!'
                : 'Si tienes alguna pregunta o idea para cualquiera de mis proyectos, no dudes en contactarme!'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
