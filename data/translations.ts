export const translations = {
  en: {
    backToPortfolio: "Back to Portfolio",
    title: "Argentine Inflation Tracker",
    subtitle: "Track inflation and convert prices across 30 years of Argentine economic history",
    overview: "Overview",
    overviewText: "This project provides a comprehensive tool for tracking Argentine inflation from 1995 to present. Using official data from FRED and OECD sources, it allows users to visualize inflation trends and understand the real value of money over time. The price converter is particularly useful for understanding purchasing power changes in Argentina's volatile economic environment.",
    
    // Price Converter
    priceConverter: "Price Converter",
    convertDesc: "See how inflation affected your money",
    amount: "Amount",
    fromDate: "From Date",
    toDate: "To Date",
    convert: "Convert",
    originalValue: "Original Value",
    convertedValue: "Converted Value",
    inflationChange: "Inflation Change",
    
    // Stats
    currentStats: "Current Inflation Statistics",
    monthlyRate: "Monthly Rate",
    annualRate: "Annual Rate",
    avg12Months: "12-Month Average",
    totalSince1995: "Total Since 1995",
    
    // Charts
    inflationTrend: "Inflation Trend",
    historicalData: "Historical Inflation Data",
    monthly: "Monthly",
    annual: "Annual",
    
    // Data Sources
    dataSourcesTitle: "Data Sources & Methodology",
    dataSourcesText: "This project tracks Argentine inflation from 1990 to present using official data sources. Historical data (1990-2006) uses reliable official figures. Post-2016 data comes directly from FRED/OECD and reflects reformed INDEC methodology that meets international standards. This tool is designed for educational and analytical purposes, presenting economic data objectively without political interpretation.",
    dataQualityNote: "Note: Data from 2007-2016 reflects known quality limitations during a period of institutional challenges at Argentina's statistics agency.",
    dataIntegrityDisclaimerTitle: "Data Accuracy Note",
    dataIntegrityDisclaimer: "Official inflation data from 2007-2015 reflects known data quality limitations during a period of institutional challenges at Argentina's statistics agency (INDEC). During this period, methodological issues and international assessments raised concerns about the accuracy of official CPI figures. The IMF expressed concerns about statistical methodology in 2013. Data quality improved after 2015 when revised methodologies aligned with international standards were implemented. For analytical purposes, users should be aware that alternative estimates for this period may differ from official figures.",
    hyperinflationNote: "Historical Context: Prior to the graph's start date (1991), Argentina experienced a period of hyperinflation reaching 1,344% in 1990. The Convertibility Plan implemented in 1991 stabilized the economy and brought inflation down to manageable levels. This graph focuses on the post-convertibility period to provide better readability of recent economic trends.",
    
    // Common
    loading: "Loading data...",
    error: "Error loading data",
    retry: "Retry",
    viewCode: "View Code",
    apiDocs: "API Documentation",
    jumpToYear: "Jump to Year",
    showMiniMap: "Show Overview",
    hideMiniMap: "Hide Overview"
  },
  es: {
    backToPortfolio: "Volver al Portfolio",
    title: "Rastreador de Inflación Argentina",
    subtitle: "Rastrea la inflación y convierte precios a través de 30 años de historia económica argentina",
    overview: "Descripción General",
    overviewText: "Este proyecto proporciona una herramienta integral para rastrear la inflación argentina desde 1995 hasta el presente. Utilizando datos oficiales de FRED y OECD, permite a los usuarios visualizar tendencias de inflación y comprender el valor real del dinero a lo largo del tiempo. El convertidor de precios es particularmente útil para entender los cambios en el poder adquisitivo en el volátil entorno económico argentino.",
    
    priceConverter: "Convertidor de Precios",
    convertDesc: "Ve cómo la inflación afectó tu dinero",
    amount: "Monto",
    fromDate: "Desde Fecha",
    toDate: "Hasta Fecha",
    convert: "Convertir",
    originalValue: "Valor Original",
    convertedValue: "Valor Convertido",
    inflationChange: "Cambio por Inflación",
    
    currentStats: "Estadísticas de Inflación Actual",
    monthlyRate: "Tasa Mensual",
    annualRate: "Tasa Anual",
    avg12Months: "Promedio 12 Meses",
    totalSince1995: "Total Desde 1995",
    
    inflationTrend: "Tendencia de Inflación",
    historicalData: "Datos Históricos de Inflación",
    monthly: "Mensual",
    annual: "Anual",
    
    // Data Sources
    dataSourcesTitle: "Fuentes de Datos y Metodología",
    dataSourcesText: "Este proyecto rastrea la inflación argentina desde 1990 hasta el presente utilizando fuentes de datos oficiales. Los datos históricos (1990-2006) utilizan cifras oficiales confiables. Los datos post-2016 provienen directamente de FRED/OECD y reflejan la metodología reformada del INDEC que cumple con estándares internacionales. Esta herramienta está diseñada con fines educativos y analíticos, presentando datos económicos de manera objetiva sin interpretación política.",
    dataQualityNote: "Nota: Los datos de 2007-2016 reflejan limitaciones de calidad conocidas durante un período de desafíos institucionales en la agencia de estadísticas de Argentina.",
    dataIntegrityDisclaimerTitle: "Nota sobre Precisión de Datos",
    dataIntegrityDisclaimer: "Los datos oficiales de inflación de 2007-2015 reflejan limitaciones de calidad de datos conocidas durante un período de desafíos institucionales en la agencia de estadísticas de Argentina (INDEC). Durante este período, problemas metodológicos y evaluaciones internacionales plantearon preocupaciones sobre la precisión de las cifras oficiales del IPC. El FMI expresó preocupaciones sobre la metodología estadística en 2013. La calidad de los datos mejoró después de 2015 cuando se implementaron metodologías revisadas alineadas con estándares internacionales. Para fines analíticos, los usuarios deben ser conscientes de que las estimaciones alternativas para este período pueden diferir de las cifras oficiales.",
    hyperinflationNote: "Contexto Histórico: Antes de la fecha de inicio del gráfico (1991), Argentina experimentó un período de hiperinflación que alcanzó el 1,344% en 1990. El Plan de Convertibilidad implementado en 1991 estabilizó la economía y redujo la inflación a niveles manejables. Este gráfico se enfoca en el período post-convertibilidad para proporcionar mejor legibilidad de las tendencias económicas recientes.",
    
    loading: "Cargando datos...",
    error: "Error al cargar datos",
    retry: "Reintentar",
    viewCode: "Ver Código",
    apiDocs: "Documentación API",
    jumpToYear: "Ir a Año",
    showMiniMap: "Mostrar Vista General",
    hideMiniMap: "Ocultar Vista General"
  }
};

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof translations.en;


