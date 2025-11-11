import { ProjectPageClient } from "./project-page-client"

const projectData: Record<string, any> = {
  "sentiment-analysis": {
    title: {
      en: "Argentine Political Sentiment Analysis",
      es: "Análisis de Sentimiento Político Argentino"
    },
    description: {
      en: "Real-time sentiment analysis of Argentine political discussions from Reddit using NLP and machine learning",
      es: "Análisis en tiempo real del sentimiento en discusiones políticas argentinas de Reddit usando PLN y aprendizaje automático",
    },
    fullDescription: {
      en: "This project implements a comprehensive sentiment analysis system that monitors Argentine political discussions across multiple Reddit communities. Using natural language processing and the VADER sentiment analyzer, it automatically collects, analyzes, and visualizes public sentiment on political topics. The system provides real-time insights into how Argentines are discussing politics online, with support for tracking sentiment trends, identifying hot topics, and analyzing individual posts.",
      es: "Este proyecto implementa un sistema integral de análisis de sentimiento que monitorea discusiones políticas argentinas en múltiples comunidades de Reddit. Utilizando procesamiento de lenguaje natural y el analizador de sentimientos VADER, recopila, analiza y visualiza automáticamente el sentimiento público sobre temas políticos. El sistema proporciona información en tiempo real sobre cómo los argentinos discuten política en línea, con soporte para rastrear tendencias de sentimiento, identificar temas candentes y analizar publicaciones individuales.",
    },
    tags: ["Python", "FastAPI", "NLP", "VADER", "Reddit API", "SQLAlchemy"],
    features: {
      en: [
        "Real-time sentiment analysis from Reddit posts",
        "VADER sentiment analyzer integration",
        "Trending topics identification",
        "Interactive data visualization with Recharts",
        "RESTful API with FastAPI",
      ],
      es: [
        "Análisis de sentimiento en tiempo real desde publicaciones de Reddit",
        "Integración del analizador de sentimientos VADER",
        "Identificación de temas en tendencia",
        "Visualización interactiva de datos con Recharts",
        "API RESTful con FastAPI",
      ],
    },
    technologies: ["Python", "FastAPI", "VADER Sentiment Analyzer", "SQLAlchemy", "PostgreSQL", "Reddit API", "Next.js", "Recharts"],
    github: "https://github.com/rodriperezdev/sentiment-analysis-backend",
    demo: "/projects/sentiment-analysis",
  },
  "ml-pipeline-orchestrator": {
    title: {
      en: "ML Pipeline Orchestrator",
      es: "Orquestador de Pipelines de ML"
    },
    description: {
      en: "Automated machine learning pipeline for data preprocessing, model training, and deployment. Built with Python, Apache Airflow, and Docker.",
      es: "Pipeline automatizado de aprendizaje automático para preprocesamiento de datos, entrenamiento de modelos y despliegue. Construido con Python, Apache Airflow y Docker.",
    },
    fullDescription: {
      en: "This project implements a comprehensive machine learning pipeline orchestration system that automates the entire ML workflow from data ingestion to model deployment. The system handles data preprocessing, feature engineering, model training, validation, and deployment in a scalable and reproducible manner. Built with Apache Airflow for workflow orchestration, it ensures reliable execution of complex ML tasks with proper error handling and monitoring.",
      es: "Este proyecto implementa un sistema integral de orquestación de pipelines de aprendizaje automático que automatiza todo el flujo de trabajo de ML desde la ingesta de datos hasta el despliegue del modelo. El sistema maneja el preprocesamiento de datos, ingeniería de características, entrenamiento de modelos, validación y despliegue de manera escalable y reproducible. Construido con Apache Airflow para la orquestación de flujos de trabajo, garantiza la ejecución confiable de tareas complejas de ML con manejo adecuado de errores y monitoreo.",
    },
    tags: ["Python", "TensorFlow", "Docker", "Airflow"],
    features: {
      en: [
        "Automated data preprocessing and feature engineering",
        "Model training with hyperparameter optimization",
        "Continuous integration and deployment pipeline",
        "Real-time monitoring and alerting",
        "Scalable architecture using Docker containers",
      ],
      es: [
        "Preprocesamiento automatizado de datos e ingeniería de características",
        "Entrenamiento de modelos con optimización de hiperparámetros",
        "Pipeline de integración y despliegue continuo",
        "Monitoreo y alertas en tiempo real",
        "Arquitectura escalable usando contenedores Docker",
      ],
    },
    technologies: ["Python 3.9+", "TensorFlow 2.x", "Apache Airflow", "Docker", "PostgreSQL", "Redis"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  "realtime-analytics-api": {
    title: {
      en: "Real-Time Analytics API",
      es: "API de Análisis en Tiempo Real"
    },
    description: {
      en: "High-performance REST API processing 10K+ requests/second with real-time data aggregation. Built with Node.js, Redis, and PostgreSQL.",
      es: "API REST de alto rendimiento procesando más de 10K solicitudes/segundo con agregación de datos en tiempo real. Construido con Node.js, Redis y PostgreSQL.",
    },
    fullDescription: {
      en: "A high-performance REST API designed to handle massive concurrent requests while providing real-time analytics and data aggregation. The system uses Redis for caching and real-time data processing, PostgreSQL for persistent storage, and WebSocket for live updates. The architecture is optimized for low latency and high throughput, capable of processing over 10,000 requests per second.",
      es: "Una API REST de alto rendimiento diseñada para manejar solicitudes concurrentes masivas mientras proporciona análisis en tiempo real y agregación de datos. El sistema utiliza Redis para caché y procesamiento de datos en tiempo real, PostgreSQL para almacenamiento persistente y WebSocket para actualizaciones en vivo. La arquitectura está optimizada para baja latencia y alto rendimiento, capaz de procesar más de 10,000 solicitudes por segundo.",
    },
    tags: ["Node.js", "Redis", "PostgreSQL", "WebSocket"],
    features: {
      en: [
        "Real-time data aggregation and analytics",
        "WebSocket support for live updates",
        "Redis caching for optimal performance",
        "Rate limiting and request throttling",
        "Comprehensive API documentation",
      ],
      es: [
        "Agregación de datos y análisis en tiempo real",
        "Soporte WebSocket para actualizaciones en vivo",
        "Caché Redis para rendimiento óptimo",
        "Limitación de tasa y control de solicitudes",
        "Documentación completa de API",
      ],
    },
    technologies: ["Node.js", "Express", "Redis", "PostgreSQL", "WebSocket", "Docker"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  "predictive-maintenance-system": {
    title: {
      en: "Predictive Maintenance System",
      es: "Sistema de Mantenimiento Predictivo"
    },
    description: {
      en: "IoT-based predictive maintenance system using time-series analysis and neural networks to forecast equipment failures.",
      es: "Sistema de mantenimiento predictivo basado en IoT usando análisis de series temporales y redes neuronales para predecir fallas de equipos.",
    },
    fullDescription: {
      en: "An IoT-based predictive maintenance system that leverages time-series analysis and deep learning to forecast equipment failures before they occur. The system collects sensor data from industrial equipment, processes it in real-time, and uses neural networks to predict potential failures. This proactive approach reduces downtime and maintenance costs significantly.",
      es: "Un sistema de mantenimiento predictivo basado en IoT que aprovecha el análisis de series temporales y el aprendizaje profundo para predecir fallas de equipos antes de que ocurran. El sistema recopila datos de sensores de equipos industriales, los procesa en tiempo real y utiliza redes neuronales para predecir posibles fallas. Este enfoque proactivo reduce significativamente el tiempo de inactividad y los costos de mantenimiento.",
    },
    tags: ["Python", "PyTorch", "TimescaleDB", "MQTT"],
    features: {
      en: [
        "Real-time sensor data collection via MQTT",
        "Time-series analysis for pattern detection",
        "Neural network-based failure prediction",
        "Alert system for maintenance scheduling",
        "Historical data analysis and reporting",
      ],
      es: [
        "Recopilación de datos de sensores en tiempo real vía MQTT",
        "Análisis de series temporales para detección de patrones",
        "Predicción de fallas basada en redes neuronales",
        "Sistema de alertas para programación de mantenimiento",
        "Análisis de datos históricos e informes",
      ],
    },
    technologies: ["Python", "PyTorch", "TimescaleDB", "MQTT", "Grafana", "Docker"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  "distributed-data-processor": {
    title: {
      en: "Distributed Data Processor",
      es: "Procesador de Datos Distribuido"
    },
    description: {
      en: "Scalable data processing framework handling petabytes of data using Apache Spark and Kubernetes orchestration.",
      es: "Framework de procesamiento de datos escalable manejando petabytes de datos usando Apache Spark y orquestación con Kubernetes.",
    },
    fullDescription: {
      en: "A distributed data processing framework built on Apache Spark and orchestrated with Kubernetes, designed to handle petabyte-scale data processing tasks. The system provides fault tolerance, automatic scaling, and efficient resource utilization. It's optimized for batch and stream processing, making it suitable for various big data applications.",
      es: "Un framework de procesamiento de datos distribuido construido sobre Apache Spark y orquestado con Kubernetes, diseñado para manejar tareas de procesamiento de datos a escala de petabytes. El sistema proporciona tolerancia a fallos, escalado automático y utilización eficiente de recursos. Está optimizado para procesamiento por lotes y en streaming, lo que lo hace adecuado para diversas aplicaciones de big data.",
    },
    tags: ["Spark", "Kubernetes", "Scala", "Kafka"],
    features: {
      en: [
        "Petabyte-scale data processing",
        "Automatic scaling with Kubernetes",
        "Fault-tolerant architecture",
        "Support for batch and stream processing",
        "Integration with Apache Kafka",
      ],
      es: [
        "Procesamiento de datos a escala de petabytes",
        "Escalado automático con Kubernetes",
        "Arquitectura tolerante a fallos",
        "Soporte para procesamiento por lotes y streaming",
        "Integración con Apache Kafka",
      ],
    },
    technologies: ["Apache Spark", "Kubernetes", "Scala", "Apache Kafka", "HDFS", "Docker"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  "inflation-tracker": {
    title: {
      en: "Argentine Inflation Tracker",
      es: "Rastreador de Inflación Argentina"
    },
    description: {
      en: "Track inflation and convert prices across 30 years of Argentine economic history. Using official data from FRED and OECD sources.",
      es: "Rastrea la inflación y convierte precios a través de 30 años de historia económica argentina. Utilizando datos oficiales de FRED y OECD.",
    },
    fullDescription: {
      en: "This project provides a comprehensive tool for tracking Argentine inflation from 1995 to present. Using official data from FRED and OECD sources, it allows users to visualize inflation trends and understand the real value of money over time. The price converter is particularly useful for understanding purchasing power changes in Argentina's volatile economic environment.",
      es: "Este proyecto proporciona una herramienta integral para rastrear la inflación argentina desde 1995 hasta el presente. Utilizando datos oficiales de FRED y OECD, permite a los usuarios visualizar tendencias de inflación y comprender el valor real del dinero a lo largo del tiempo. El convertidor de precios es particularmente útil para entender los cambios en el poder adquisitivo en el volátil entorno económico argentino.",
    },
    tags: ["Python", "FastAPI", "FRED API", "SQLAlchemy", "Next.js", "Recharts"],
    features: {
      en: [
        "Historical inflation data from 1995 to present",
        "Price converter with inflation-adjusted calculations",
        "Interactive data visualization with Recharts",
        "Real-time inflation statistics",
        "RESTful API with FastAPI",
      ],
      es: [
        "Datos históricos de inflación desde 1995 hasta el presente",
        "Convertidor de precios con cálculos ajustados por inflación",
        "Visualización interactiva de datos con Recharts",
        "Estadísticas de inflación en tiempo real",
        "API RESTful con FastAPI",
      ],
    },
    technologies: ["Python", "FastAPI", "FRED API", "SQLAlchemy", "PostgreSQL", "Next.js", "Recharts"],
    github: "https://github.com/rodriperezdev/inflation-tracker-backend",
    demo: "/projects/inflation-tracker",
  },
  "match-predictor": {
    title: {
      en: "Football Match Predictor",
      es: "Predictor de Partidos de Fútbol"
    },
    description: {
      en: "Predict match outcomes using machine learning models trained on Argentine Primera División data. Built with Python, FastAPI, scikit-learn, and XGBoost.",
      es: "Predice resultados de partidos usando modelos de aprendizaje automático entrenados con datos de la Primera División Argentina. Construido con Python, FastAPI, scikit-learn y XGBoost.",
    },
    fullDescription: {
      en: "This project uses machine learning to predict football match outcomes in the Argentine Primera División. The model analyzes team form, goal differences, head-to-head records, and other statistical features to make predictions. Built with Python, FastAPI, scikit-learn, and XGBoost, it provides accurate predictions with probability distributions for each possible outcome.",
      es: "Este proyecto utiliza aprendizaje automático para predecir resultados de partidos de fútbol en la Primera División Argentina. El modelo analiza la forma de los equipos, diferencias de goles, historial cara a cara y otras características estadísticas para hacer predicciones. Construido con Python, FastAPI, scikit-learn y XGBoost, proporciona predicciones precisas con distribuciones de probabilidad para cada resultado posible.",
    },
    tags: ["Python", "FastAPI", "scikit-learn", "XGBoost", "Machine Learning", "Next.js"],
    features: {
      en: [
        "Machine learning-based match prediction",
        "Team form and statistics analysis",
        "Head-to-head record tracking",
        "Probability distribution for outcomes",
        "RESTful API with FastAPI",
      ],
      es: [
        "Predicción de partidos basada en aprendizaje automático",
        "Análisis de forma y estadísticas de equipos",
        "Seguimiento de historial cara a cara",
        "Distribución de probabilidades para resultados",
        "API RESTful con FastAPI",
      ],
    },
    technologies: ["Python", "FastAPI", "scikit-learn", "XGBoost", "pandas", "Next.js", "TypeScript"],
    github: "https://github.com/rodriperezdev/match-predictor-backend",
    demo: "/projects/match-predictor",
  },
  "business-analysis": {
    title: {
      en: "Business Analytics",
      es: "Análisis de Negocios"
    },
    description: {
      en: "Input business data and get comprehensive analysis with metrics, benchmarks, and actionable insights. Built with Python, FastAPI, and Next.js.",
      es: "Ingresa datos de tu negocio y obtén un análisis completo con métricas, benchmarks e insights accionables. Construido con Python, FastAPI y Next.js.",
    },
    fullDescription: {
      en: "This tool allows you to input your business metrics and receive a comprehensive analysis including financial calculations, industry benchmarking, and actionable insights. Perfect for startups, small businesses, and entrepreneurs who want to understand their business performance and identify areas for improvement. The system calculates key metrics like gross margin, net margin, CAC, LTV, burn rate, and more, then compares them against industry benchmarks to provide actionable recommendations.",
      es: "Esta herramienta te permite ingresar las métricas de tu negocio y recibir un análisis completo que incluye cálculos financieros, benchmarking de la industria e insights accionables. Perfecto para startups, pequeñas empresas y emprendedores que quieren entender el rendimiento de su negocio e identificar áreas de mejora. El sistema calcula métricas clave como margen bruto, margen neto, CAC, LTV, tasa de quema y más, luego las compara con benchmarks de la industria para proporcionar recomendaciones accionables.",
    },
    tags: ["Python", "FastAPI", "Pydantic", "Next.js", "TypeScript", "Recharts"],
    features: {
      en: [
        "Financial metrics calculation (margins, profitability, customer economics)",
        "Industry benchmarking against standards",
        "Actionable insights with prioritized recommendations",
        "What-if scenario analysis",
        "RESTful API with FastAPI",
        "Interactive charts and visualizations",
      ],
      es: [
        "Cálculo de métricas financieras (márgenes, rentabilidad, economía de clientes)",
        "Benchmarking de la industria contra estándares",
        "Insights accionables con recomendaciones priorizadas",
        "Análisis de escenarios what-if",
        "API RESTful con FastAPI",
        "Gráficos y visualizaciones interactivas",
      ],
    },
    technologies: ["Python", "FastAPI", "Pydantic", "pydantic-settings", "Next.js", "TypeScript", "Recharts"],
    github: "https://github.com/rodriperezdev/business-analysis-backend",
    demo: "/projects/business-analysis",
  },
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectData[slug]

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  return <ProjectPageClient project={project} slug={slug} />
}
