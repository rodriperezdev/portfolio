'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
import { getApiUrl } from '@/lib/api-config';

// Import components
import { PredictionForm } from '@/components/match-predictor/PredictionForm';

// Import hooks
import { useMatchPredictorData } from '@/hooks/useMatchPredictorData';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

// Get API URL from centralized config
const API_BASE_URL = getApiUrl('match-predictor');

const translations = {
  en: {
    backToPortfolio: 'Back to Portfolio',
    title: 'Football Match Predictor',
    subtitle: 'Predict match outcomes using machine learning models trained on Argentine Primera División data',
    overview: 'Overview',
    overviewText: 'This project uses machine learning to predict football match outcomes in the Argentine Primera División. The system trains multiple machine learning algorithms—including Logistic Regression, Random Forest, Gradient Boosting, and XGBoost—and automatically selects the best performing model based on accuracy. The model analyzes team form, goal differences, head-to-head records, betting odds, and other statistical features to make predictions. Built with Python, FastAPI, scikit-learn, and XGBoost. The selected model achieves approximately 40-50% accuracy on test data, which is significantly better than random chance (33%) for a three-outcome prediction task. Each prediction includes probability distributions for all possible outcomes, allowing users to assess the confidence level of each forecast.',
    loading: 'Loading data...',
    error: 'Error loading data',
    retry: 'Retry',
    viewCode: 'View Code',
    apiDocs: 'API Documentation',
    makePrediction: 'Make a Prediction',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    selectHomeTeam: 'Select home team',
    selectAwayTeam: 'Select away team',
    predict: 'Predict',
    prediction: 'Prediction',
    confidence: 'Confidence',
    homeWin: 'Home Win',
    draw: 'Draw',
    awayWin: 'Away Win',
    win: 'Win',
    totalMatches: 'Total Matches',
    homeWins: 'Home Wins',
    draws: 'Draws',
    awayWins: 'Away Wins',
    selectDifferentTeams: 'Please select two different teams',
    noRecentMatches: 'No recent matches found',
    recentMatches: 'Recent Matches',
    disclaimer: '* This predictor was created for educational purposes only and should not be used as a reliable source for predicting match results or making betting decisions.',
  },
  es: {
    backToPortfolio: 'Volver al Portfolio',
    title: 'Predictor de Partidos de Fútbol',
    subtitle: 'Predice resultados de partidos usando modelos de aprendizaje automático entrenados con datos de la Primera División Argentina',
    overview: 'Descripción General',
    overviewText: 'Este proyecto utiliza aprendizaje automático para predecir resultados de partidos de fútbol en la Primera División Argentina. El sistema entrena múltiples algoritmos de aprendizaje automático—incluyendo Regresión Logística, Random Forest, Gradient Boosting y XGBoost—y automáticamente selecciona el modelo con mejor rendimiento basado en precisión. El modelo analiza la forma de los equipos, diferencias de goles, historial cara a cara, cuotas de apuestas y otras características estadísticas para hacer predicciones. Construido con Python, FastAPI, scikit-learn y XGBoost. El modelo seleccionado logra aproximadamente 40-50% de precisión en datos de prueba, lo cual es significativamente mejor que el azar (33%) para una tarea de predicción de tres resultados. Cada predicción incluye distribuciones de probabilidad para todos los resultados posibles, permitiendo a los usuarios evaluar el nivel de confianza de cada pronóstico.',
    loading: 'Cargando datos...',
    error: 'Error al cargar datos',
    retry: 'Reintentar',
    viewCode: 'Ver Código',
    apiDocs: 'Documentación API',
    makePrediction: 'Hacer una Predicción',
    homeTeam: 'Equipo Local',
    awayTeam: 'Equipo Visitante',
    selectHomeTeam: 'Seleccionar equipo local',
    selectAwayTeam: 'Seleccionar equipo visitante',
    predict: 'Predecir',
    prediction: 'Predicción',
    confidence: 'Confianza',
    homeWin: 'Victoria Local',
    draw: 'Empate',
    awayWin: 'Victoria Visitante',
    win: 'Gana',
    totalMatches: 'Total de Partidos',
    homeWins: 'Victorias Locales',
    draws: 'Empates',
    awayWins: 'Victorias Visitantes',
    selectDifferentTeams: 'Por favor selecciona dos equipos diferentes',
    noRecentMatches: 'No se encontraron partidos recientes',
    recentMatches: 'Partidos Recientes',
    disclaimer: '* Este predictor fue creado únicamente con fines educativos y no debe ser utilizado como fuente confiable para predecir resultados de partidos o tomar decisiones de apuestas.',
  },
};

export default function MatchPredictorPage() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { teams, stats, loading, error } = useMatchPredictorData(API_BASE_URL);
  
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
            {['Python', 'FastAPI', 'scikit-learn', 'XGBoost', 'Machine Learning', 'Next.js'].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 border border-[rgb(var(--foreground))]/20 rounded-full text-xs sm:text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button size="lg" className="border-black text-sm sm:text-base min-h-[44px] w-full sm:w-auto cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg group" asChild>
              <a href="https://github.com/rodriperezdev/match-predictor-backend" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Github className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                {t.viewCode}
              </a>
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 md:p-8 bg-[rgb(var(--card))] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>{t.overview}</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.7 }}>{t.overviewText}</p>
          <p className="text-xs italic" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 0.8 : 0.5 }}>{t.disclaimer}</p>
        </div>

        {/* Prediction Form */}
        <PredictionForm apiUrl={API_BASE_URL} teams={teams} translations={t} language={language} />
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

