'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowLeft, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/language-toggle';
import { getApiUrl } from '@/lib/api-config';

// Import components
import { CommoditySelector } from '@/components/agricultural/CommoditySelector';
import { ModelSelector } from '@/components/agricultural/ModelSelector';
import { ForecastChart } from '@/components/agricultural/ForecastChart';
import { ScenarioForm } from '@/components/agricultural/ScenarioForm';
import { StatsDisplay } from '@/components/agricultural/StatsDisplay';

// Import hooks
import { useAgriculturalData, type CommodityData, type ScenarioResult } from '@/hooks/useAgriculturalData';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

// Translations
const translations = {
  en: {
    title: 'Agricultural Commodity Price Forecasting',
    subtitle: 'Advanced time series forecasting for Argentine agricultural exports using machine learning. Predict prices for soy, wheat, and corn with Prophet and LSTM models.',
    backToPortfolio: 'Back to Portfolio',
    viewCode: 'View Code',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    overview: 'Project Overview',
    overviewText: 'This forecasting system combines historical commodity prices from Yahoo Finance with weather data from Open-Meteo to predict future price trends for Argentina\'s key agricultural exports. The system uses two state-of-the-art models: Prophet (developed by Facebook) for interpretable forecasts with confidence intervals, and LSTM (Long Short-Term Memory) neural networks for capturing complex sequential patterns. Users can also run scenario analyses to understand how climate changes might impact commodity prices.',
    dataSourcesTitle: 'Data Sources & Methodology',
    dataSourcesText: 'The system fetches real-time data from Yahoo Finance (commodity futures: ZS=F for soy, ZW=F for wheat, ZC=F for corn) and historical weather data from Open-Meteo API for Argentina\'s agricultural core region. Models are trained with up to 5 years of historical data and cached for 24 hours to ensure fast predictions.',
    selectCommodity: 'Select Commodity',
    chooseCommodity: 'Choose a commodity',
    selectModel: 'Select Model',
    withConfidenceIntervals: 'With confidence intervals',
    deepLearning: 'Deep learning',
    getForecast: 'Get Forecast',
    forecasting: 'Forecasting...',
    scenarioAnalysis: 'Scenario Analysis',
    scenarioDescription: 'Adjust weather parameters to see how they might impact commodity prices.',
    temperatureChange: 'Temperature Change',
    precipitationChange: 'Precipitation Change',
    runScenario: 'Run Scenario',
    analyzing: 'Analyzing...',
    noDataAvailable: 'No data available',
    actualPrices: 'Actual prices',
    forecast: 'Forecast',
    upperBound: 'Upper bound',
    lowerBound: 'Lower bound',
    currentPrice: 'Current Price',
    forecastTrend: 'Forecast Trend',
    forecastPeriod: 'Forecast Period',
    days: 'days',
    until: 'Until',
    scenarioResults: 'Scenario Results',
    baselineVsScenario: 'Baseline vs Scenario',
    baseline: 'Baseline',
    scenario: 'Scenario',
    soy: 'Soy',
    wheat: 'Wheat',
    corn: 'Corn',
    priceForecast: 'Price Forecast',
    currencyUnit: 'USD per ton',
    futurePredictions: 'Future Predictions',
    modelAccuracy: 'Model Accuracy',
    validationScore: 'Validation score',
  },
  es: {
    title: 'Pronóstico de Precios de Commodities Agrícolas',
    subtitle: 'Pronóstico avanzado de series temporales para exportaciones agrícolas argentinas usando aprendizaje automático. Predice precios de soja, trigo y maíz con modelos Prophet y LSTM.',
    backToPortfolio: 'Volver al Portafolio',
    viewCode: 'Ver Código',
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    overview: 'Descripción del Proyecto',
    overviewText: 'Este sistema de pronóstico combina precios históricos de commodities de Yahoo Finance con datos meteorológicos de Open-Meteo para predecir tendencias futuras de precios para las exportaciones agrícolas clave de Argentina. El sistema utiliza dos modelos de vanguardia: Prophet (desarrollado por Facebook) para pronósticos interpretables con intervalos de confianza, y redes neuronales LSTM (Long Short-Term Memory) para capturar patrones secuenciales complejos. Los usuarios también pueden ejecutar análisis de escenarios para comprender cómo los cambios climáticos podrían impactar los precios de los commodities.',
    dataSourcesTitle: 'Fuentes de Datos y Metodología',
    dataSourcesText: 'El sistema obtiene datos en tiempo real de Yahoo Finance (futuros de commodities: ZS=F para soja, ZW=F para trigo, ZC=F para maíz) y datos meteorológicos históricos de la API Open-Meteo para la región núcleo agrícola de Argentina. Los modelos se entrenan con hasta 5 años de datos históricos y se almacenan en caché durante 24 horas para garantizar predicciones rápidas.',
    selectCommodity: 'Seleccionar Commodity',
    chooseCommodity: 'Elegir un commodity',
    selectModel: 'Seleccionar Modelo',
    withConfidenceIntervals: 'Con intervalos de confianza',
    deepLearning: 'Aprendizaje profundo',
    getForecast: 'Obtener Pronóstico',
    forecasting: 'Pronosticando...',
    scenarioAnalysis: 'Análisis de Escenarios',
    scenarioDescription: 'Ajusta los parámetros climáticos para ver cómo podrían impactar los precios de los commodities.',
    temperatureChange: 'Cambio de Temperatura',
    precipitationChange: 'Cambio de Precipitación',
    runScenario: 'Ejecutar Escenario',
    analyzing: 'Analizando...',
    noDataAvailable: 'No hay datos disponibles',
    actualPrices: 'Precios reales',
    forecast: 'Pronóstico',
    upperBound: 'Límite superior',
    lowerBound: 'Límite inferior',
    currentPrice: 'Precio Actual',
    forecastTrend: 'Tendencia del Pronóstico',
    forecastPeriod: 'Período del Pronóstico',
    days: 'días',
    until: 'Hasta',
    scenarioResults: 'Resultados del Escenario',
    baselineVsScenario: 'Base vs Escenario',
    baseline: 'Base',
    scenario: 'Escenario',
    soy: 'Soja',
    wheat: 'Trigo',
    corn: 'Maíz',
    priceForecast: 'Pronóstico de Precios',
    currencyUnit: 'USD por tonelada',
    futurePredictions: 'Predicciones Futuras',
    modelAccuracy: 'Precisión del Modelo',
    validationScore: 'Puntuación de validación',
  },
};

// Get API URL from centralized config
const API_BASE_URL = getApiUrl('agricultural');

export default function AgriculturalForecastingPage() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { commodities, loading: initialLoading, error: initialError, fetchForecast, runScenario } = useAgriculturalData(API_BASE_URL);
  
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'prophet' | 'lstm'>('prophet');
  const [forecastData, setForecastData] = useState<CommodityData | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = translations[language];

  // Set default commodity when commodities load
  if (!selectedCommodity && commodities.length > 0) {
    setSelectedCommodity(commodities[0]);
  }

  const handleGetForecast = async () => {
    if (!selectedCommodity) return;

    setLoading(true);
    setError(null);
    setScenarioData(null); // Clear scenario data when getting new forecast

    try {
      const data = await fetchForecast(selectedCommodity, selectedModel, 30);
      setForecastData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forecast');
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScenario = async (params: any) => {
    if (!selectedCommodity) return;

    setScenarioLoading(true);
    setError(null);

    try {
      const data = await runScenario(selectedCommodity, params);
      setScenarioData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run scenario');
      setScenarioData(null);
    } finally {
      setScenarioLoading(false);
    }
  };

  const handleModelChange = (newModel: 'prophet' | 'lstm') => {
    console.log('Model change requested:', newModel, 'from:', selectedModel);
    setSelectedModel(newModel);
    setForecastData(null); // Clear previous forecast
    setScenarioData(null); // Clear scenario data
  };

  // Loading state
  if (initialLoading) {
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
  if (initialError) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-4">
        <div className="border border-[rgb(var(--foreground))]/10 bg-[rgb(var(--card))] rounded-2xl p-8 max-w-md shadow-lg">
          <h2 className="text-[rgb(var(--foreground))] text-2xl font-bold mb-4">⚠️ {t.error}</h2>
          <p className="text-[rgb(var(--foreground))] opacity-70 mb-4">{initialError}</p>
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
            {['Python', 'FastAPI', 'Prophet', 'PyTorch', 'LSTM', 'yfinance', 'Open-Meteo'].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 border border-[rgb(var(--foreground))]/20 rounded-full text-xs sm:text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button size="lg" className="border-black text-sm sm:text-base min-h-[44px] w-full sm:w-auto cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg group" asChild>
              <a href="https://github.com/rodriperezdev/agricultural-forecasting-backend" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
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
          
          <div className="pt-6 mt-6 border-t border-[rgb(var(--foreground))]/10">
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.9 }}>{t.dataSourcesTitle}</h3>
            <p className="text-sm leading-relaxed" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.7 }}>{t.dataSourcesText}</p>
          </div>
        </div>

        {/* Forecasting Section */}
        <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">{t.priceForecast}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <CommoditySelector
              value={selectedCommodity}
              onChange={setSelectedCommodity}
              commodities={commodities}
              translations={t}
              language={language}
            />
            <ModelSelector
              value={selectedModel}
              onChange={handleModelChange}
              translations={t}
            />
          </div>

          <Button
            onClick={handleGetForecast}
            disabled={loading || !selectedCommodity}
            size="lg"
            className="w-full sm:w-auto min-h-[44px] border-2 border-[rgb(var(--foreground))]/20 hover:border-[rgb(var(--foreground))]/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 mb-6"
          >
            {loading ? t.forecasting : t.getForecast}
          </Button>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {forecastData && (
            <>
              <StatsDisplay data={forecastData} translations={t} language={language} />
              <div className="mt-6">
                <ForecastChart data={forecastData} theme={theme} translations={t} language={language} />
              </div>
            </>
          )}
        </div>

        {/* Scenario Analysis Section */}
        {forecastData && selectedModel === 'prophet' && (
          <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 bg-[rgb(var(--card))] shadow-sm">
            <ScenarioForm
              onRunScenario={handleRunScenario}
              loading={scenarioLoading}
              translations={t}
            />

            {scenarioData && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">{t.scenarioResults}</h3>
                <div className="h-[400px]">
                  <ForecastChart
                    data={{
                      commodity: scenarioData.commodity,
                      model: 'prophet',
                      historical: forecastData.historical,
                      forecast: scenarioData.forecast,
                    }}
                    theme={theme}
                    translations={t}
                    language={language}
                  />
                </div>
              </div>
            )}
          </div>
        )}
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

