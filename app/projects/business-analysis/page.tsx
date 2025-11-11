'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageToggle } from '@/components/language-toggle';
import { getApiUrl } from '@/lib/api-config';

// Import components
import { MetricsForm } from '@/components/business-analysis/MetricsForm';
import { MetricsDisplay } from '@/components/business-analysis/MetricsDisplay';
import { InsightsDisplay } from '@/components/business-analysis/InsightsDisplay';
import { MetricsChart } from '@/components/business-analysis/MetricsChart';

// Import hooks
import { useBusinessAnalysisData, BusinessMetrics } from '@/hooks/useBusinessAnalysisData';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

// Import utilities
import { formatCurrencyNote, formatDate } from '@/lib/business-analysis-utils';

// Get API URL from centralized config
const API_BASE_URL = getApiUrl('business-analysis');

const translations = {
  en: {
    backToPortfolio: 'Back to Portfolio',
    title: 'Business Analytics',
    subtitle: 'Input business data and get comprehensive analysis with metrics, benchmarks, and actionable insights',
    overview: 'Overview',
    overviewText: 'This tool allows you to input your business metrics and receive a comprehensive analysis including financial calculations (such as gross profit, net profit, EBITDA, etc.), industry benchmarking, and actionable insights. Perfect for startups, small businesses, and entrepreneurs who want to understand their business performance and identify areas for improvement.',
    disclaimer: '⚠️ Educational Purpose Only: This tool is designed for educational and demonstration purposes only. The metrics, benchmarks, and insights provided should not be used to make real business decisions. Some metrics may be outdated or missing for specific types of businesses or markets. Always consult with qualified financial advisors and conduct thorough research with a data analyst before making any business decisions.',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    viewCode: 'View Code',
    apiDocs: 'API Documentation',
    analyzing: 'Analyzing...',
    metricsForm: {
      title: 'Business Metrics Input',
      market: 'Market',
      industry: 'Industry',
      timePeriod: 'Time Period (months)',
      revenue: 'Revenue',
      cogs: 'Cost of Goods Sold (COGS)',
      operatingExpenses: 'Operating Expenses',
      salesMarketing: 'Sales & Marketing Expense',
      customerMetrics: 'Customer Metrics (Optional)',
      newCustomers: 'New Customers',
      totalCustomers: 'Total Customers',
      churnedCustomers: 'Churned Customers',
      financialHealth: 'Financial Health (Optional)',
      cashBalance: 'Cash Balance',
      monthlyBurn: 'Monthly Burn Rate',
      analyze: 'Analyze Business',
      markets: {
        usa: 'United States',
        argentina: 'Argentina',
        brazil: 'Brazil',
        chile: 'Chile',
      },
    },
    metricsDisplay: {
      profitability: 'Profitability Metrics',
      customerEconomics: 'Customer Economics',
      financialHealth: 'Financial Health',
      months: 'months',
      status: {
        excellent: 'Excellent',
        good: 'Good',
        needsImprovement: 'Needs Improvement',
      },
      explanations: {
        runwayMonths: 'Cash runway indicates how many months your business can operate with current cash reserves at the current burn rate.',
        burnMultiple: 'Burn multiple measures how efficiently you\'re spending money relative to revenue growth. Lower is better.',
      },
      labels: {
        gross_profit: 'Gross Profit',
        gross_margin: 'Gross Margin',
        net_profit: 'Net Profit',
        net_margin: 'Net Margin',
        ebitda: 'EBITDA',
        ebitda_margin: 'EBITDA Margin',
        cac: 'Customer Acquisition Cost (CAC)',
        ltv: 'Lifetime Value (LTV)',
        ltv_cac_ratio: 'LTV:CAC Ratio',
        cac_payback_months: 'CAC Payback Period',
        churn_rate: 'Churn Rate',
        runway_months: 'Cash Runway',
        burn_multiple: 'Burn Multiple',
      },
    },
    insights: {
      title: 'Actionable Insights',
      noInsights: 'No insights available',
      recommendations: 'Recommendations',
      categories: {
        profitability: 'Profitability',
        growth: 'Growth',
        financial_health: 'Financial Health',
        retention: 'Retention',
      },
    },
    chart: {
      marginMetrics: 'Margin Metrics',
      customerMetrics: 'Customer Metrics',
      grossMargin: 'Gross Margin',
      netMargin: 'Net Margin',
      ebitdaMargin: 'EBITDA Margin',
      cac: 'CAC',
      ltv: 'LTV',
      ltvCacRatio: 'LTV:CAC Ratio',
      marginMetricsExplanation: 'Margin metrics show the percentage of revenue retained after costs. Gross Margin = (Revenue - COGS) / Revenue × 100%. Net Margin = (Net Profit / Revenue) × 100%. EBITDA Margin = (EBITDA / Revenue) × 100%. Higher margins indicate better profitability.',
      customerMetricsExplanation: 'Customer metrics measure acquisition costs, lifetime value, and the efficiency of your customer acquisition strategy. CAC is the cost to acquire one customer. LTV is the total revenue a customer generates over their lifetime. LTV:CAC ratio shows the return on customer acquisition investment.',
    },
    currencyInfo: {
      title: 'Currency Conversion',
      rateAsOf: 'Rate as of',
      approximation: 'This is an approximation of the real value based on current exchange rates',
    },
  },
  es: {
    backToPortfolio: 'Volver al Portfolio',
    title: 'Análisis de Negocios',
    subtitle: 'Ingresa datos de tu negocio y obtén un análisis completo con métricas, benchmarks e insights accionables',
    overview: 'Descripción General',
    overviewText: 'Esta herramienta te permite ingresar las métricas de tu negocio y recibir un análisis completo que incluye cálculos financieros (como ganancia bruta, ganancia neta, EBITDA, etc.), benchmarking de la industria e insights accionables. Perfecto para startups, pequeñas empresas y emprendedores que quieren entender el rendimiento de su negocio e identificar áreas de mejora.',
    disclaimer: '⚠️ Solo con Fines Educativos: Esta herramienta está diseñada únicamente para fines educativos y de demostración. Las métricas, benchmarks e insights proporcionados no deben usarse para tomar decisiones comerciales reales. Algunas métricas pueden estar desactualizadas o faltar para tipos específicos de negocios o mercados. Siempre consulta con asesores financieros calificados y realiza una investigación exhaustiva con un analista de datos antes de tomar cualquier decisión comercial.',
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    viewCode: 'Ver Código',
    apiDocs: 'Documentación API',
    analyzing: 'Analizando...',
    metricsForm: {
      title: 'Ingreso de Métricas del Negocio',
      market: 'Mercado',
      industry: 'Industria',
      timePeriod: 'Período de Tiempo (meses)',
      revenue: 'Ingresos',
      cogs: 'Costo de Bienes Vendidos (COGS)',
      operatingExpenses: 'Gastos Operativos',
      salesMarketing: 'Gastos de Ventas y Marketing',
      customerMetrics: 'Métricas de Clientes (Opcional)',
      newCustomers: 'Nuevos Clientes',
      totalCustomers: 'Total de Clientes',
      churnedCustomers: 'Clientes Perdidos',
      financialHealth: 'Salud Financiera (Opcional)',
      cashBalance: 'Balance de Efectivo',
      monthlyBurn: 'Tasa de Quema Mensual',
      analyze: 'Analizar Negocio',
      markets: {
        usa: 'Estados Unidos',
        argentina: 'Argentina',
        brazil: 'Brasil',
        chile: 'Chile',
      },
    },
    metricsDisplay: {
      profitability: 'Métricas de Rentabilidad',
      customerEconomics: 'Economía de Clientes',
      financialHealth: 'Salud Financiera',
      months: 'meses',
      status: {
        excellent: 'Excelente',
        good: 'Bueno',
        needsImprovement: 'Necesita Mejora',
      },
      explanations: {
        runwayMonths: 'La reserva de efectivo indica cuántos meses puede operar tu negocio con las reservas de efectivo actuales al ritmo de quema actual.',
        burnMultiple: 'El múltiplo de quema mide qué tan eficientemente estás gastando dinero en relación al crecimiento de ingresos. Más bajo es mejor.',
      },
      labels: {
        gross_profit: 'Ganancia Bruta',
        gross_margin: 'Margen Bruto',
        net_profit: 'Ganancia Neta',
        net_margin: 'Margen Neto',
        ebitda: 'EBITDA',
        ebitda_margin: 'Margen EBITDA',
        cac: 'Costo de Adquisición de Cliente (CAC)',
        ltv: 'Valor de Vida del Cliente (LTV)',
        ltv_cac_ratio: 'Ratio LTV:CAC',
        cac_payback_months: 'Período de Recuperación CAC',
        churn_rate: 'Tasa de Abandono',
        runway_months: 'Reserva de Efectivo',
        burn_multiple: 'Múltiplo de Quema',
      },
    },
    insights: {
      title: 'Insights Accionables',
      noInsights: 'No hay insights disponibles',
      recommendations: 'Recomendaciones',
      categories: {
        profitability: 'Rentabilidad',
        growth: 'Crecimiento',
        financial_health: 'Salud Financiera',
        retention: 'Retención',
      },
    },
    chart: {
      marginMetrics: 'Métricas de Margen',
      customerMetrics: 'Métricas de Clientes',
      grossMargin: 'Margen Bruto',
      netMargin: 'Margen Neto',
      ebitdaMargin: 'Margen EBITDA',
      cac: 'CAC',
      ltv: 'LTV',
      ltvCacRatio: 'Ratio LTV:CAC',
      marginMetricsExplanation: 'Las métricas de margen muestran el porcentaje de ingresos retenidos después de los costos. Margen Bruto = (Ingresos - COGS) / Ingresos × 100%. Margen Neto = (Ganancia Neta / Ingresos) × 100%. Margen EBITDA = (EBITDA / Ingresos) × 100%. Margenes más altos indican mejor rentabilidad.',
      customerMetricsExplanation: 'Las métricas de clientes miden los costos de adquisición, el valor de vida y la eficiencia de tu estrategia de adquisición de clientes. CAC es el costo para adquirir un cliente. LTV es el ingreso total que un cliente genera durante su vida útil. El ratio LTV:CAC muestra el retorno de la inversión en adquisición de clientes.',
    },
    currencyInfo: {
      title: 'Conversión de Moneda',
      rateAsOf: 'Tasa al',
      approximation: 'Esta es una aproximación del valor real basada en las tasas de cambio actuales',
    },
  },
};

export default function BusinessAnalysisPage() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { analyzeBusiness, loading, error, analysisResult } = useBusinessAnalysisData(API_BASE_URL);

  const t = translations[language];

  const handleAnalyze = async (metrics: BusinessMetrics & { market: string }) => {
    try {
      // Send market parameter to backend for currency conversion and market-specific benchmarks
      await analyzeBusiness(metrics);
    } catch (err) {
      console.error('Analysis error:', err);
    }
  };

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
            {['Python', 'FastAPI', 'Pydantic', 'Next.js', 'TypeScript', 'Recharts'].map(tag => (
              <span key={tag} className="px-3 sm:px-4 py-1 sm:py-1.5 border border-[rgb(var(--foreground))]/20 rounded-full text-xs sm:text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button size="lg" className="border-black text-sm sm:text-base min-h-[44px] w-full sm:w-auto cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg group" asChild>
              <a href="https://github.com/rodriperezdev/business-analysis-backend" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Github className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                {t.viewCode}
              </a>
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8 sm:mb-12 border border-[rgb(var(--foreground))]/10 rounded-2xl p-4 sm:p-6 md:p-8 bg-[rgb(var(--card))] shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>{t.overview}</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 1 : 0.7 }}>
            {t.overviewText}
          </p>
          <div className="mt-4 pt-4 border-t border-[rgb(var(--foreground))]/10">
            <p className="text-xs sm:text-sm italic leading-relaxed" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--foreground))`, opacity: theme === "dark" ? 0.8 : 0.6 }}>
              {t.disclaimer}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-700 dark:text-red-400 font-medium">{t.error}: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-2"
              variant="outline"
            >
              {t.retry}
            </Button>
          </div>
        )}

        {/* Metrics Form */}
        <div className="mb-8">
          <MetricsForm
            onSubmit={handleAnalyze}
            loading={loading}
            translations={t}
          />
        </div>

        {/* Results */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Currency Info Banner */}
            {analysisResult.currency_info && (
              <Card className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      {t.currencyInfo.title}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {formatCurrencyNote(analysisResult.currency_info, language)}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                      * {t.currencyInfo.approximation}
                    </p>
                    {analysisResult.currency_info.rate_date && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {t.currencyInfo.rateAsOf}: {formatDate(analysisResult.currency_info.rate_date, language)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Metrics Display */}
            <MetricsDisplay
              metrics={analysisResult.metrics}
              metricsLocal={analysisResult.metrics_local}
              benchmarks={analysisResult.benchmarks}
              currencyInfo={analysisResult.currency_info}
              translations={t}
            />

            {/* Charts */}
            <MetricsChart
              metrics={analysisResult.metrics}
              translations={t}
            />

            {/* Insights */}
            <InsightsDisplay
              insights={analysisResult.insights}
              translations={t}
              language={language}
            />
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

