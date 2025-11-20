"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, GithubIcon, LinkedinIcon, Mail, Phone, X } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { ProjectCarousel } from "@/components/project-carousel"
import { ContactForm } from "@/components/ContactForm"
import { useTheme } from "@/hooks/useTheme"
import { useLanguage } from "@/hooks/useLanguage"

const translations = {
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      greeting: "HELLO, I'M",
      name: "Rodri",
      title: "Back-End Developer & Data Analyst",
      description:
        "I'm a developer based in Argentina. I specialize in Python and its web frameworks, database management, and RESTful API development. I also work with data science libraries to turn raw data into useful insights for your business. I genuinely enjoy the constant learning that comes with development, there's always a new challenge or tool to figure out.",
    },
    projects: {
      title: "Featured Projects",
      viewProject: "View Project",
    },
    contact: {
      title: "Let's Connect",
      description:
        "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
      phone: "Phone",
      phoneHint: "Click to open WhatsApp",
      email: "Email",
      emailHint: "Click to send a message",
      socials: "Find me on",
      form: {
        title: "Send me a message",
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "your.email@example.com",
        subject: "Subject",
        subjectPlaceholder: "What's this about?",
        message: "Message",
        messagePlaceholder: "Tell me about your project or idea...",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully! I'll get back to you soon.",
        error: "Failed to send message. Please try again or contact me directly.",
        close: "Close",
      },
    },
    footer: {
      rights: "All rights reserved.",
      message: "If you have any questions or ideas for any of my projects feel free to contact me!",
    },
  },
  es: {
    nav: {
      about: "Sobre Mí",
      projects: "Proyectos",
      contact: "Contacto",
    },
    hero: {
      greeting: "HOLA, SOY",
      name: "Rodri",
      title: "Desarrollador Back-End y Analista de Datos",
      description:
        "Soy un desarrollador basado en Argentina, me especializo en Python y sus frameworks web, gestión de bases de datos y desarrollo de APIs RESTful. También tengo conocimiento en librerías de ciencia de datos para convertir datos en bruto en información útil para tu negocio. Me encanta el aprendizaje constante que viene con el desarrollo, siempre hay un nuevo desafío o herramienta por dominar.",
    },
    projects: {
      title: "Proyectos Destacados",
      viewProject: "Ver Proyecto",
    },
    contact: {
      title: "Conectemos",
      description:
        "Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tu visión.",
      phone: "Teléfono",
      phoneHint: "Haz clic para abrir WhatsApp",
      email: "Correo",
      emailHint: "Haz clic para enviar un mensaje",
      socials: "Encuéntrame en",
      form: {
        title: "Envíame un mensaje",
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        email: "Correo",
        emailPlaceholder: "tu.correo@ejemplo.com",
        subject: "Asunto",
        subjectPlaceholder: "¿De qué se trata?",
        message: "Mensaje",
        messagePlaceholder: "Cuéntame sobre tu proyecto o idea...",
        send: "Enviar Mensaje",
        sending: "Enviando...",
        success: "¡Mensaje enviado con éxito! Te responderé pronto.",
        error: "Error al enviar el mensaje. Por favor intenta de nuevo o contáctame directamente.",
        close: "Cerrar",
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      message: "Si tienes alguna pregunta o idea para cualquiera de mis proyectos, no dudes en contactarme!",
    },
  },
}

const projects = [
  {
    title: {
      en: "Business Analytics",
      es: "Análisis de Negocios"
    },
    description: {
      en: "Input business data and get comprehensive analysis with metrics, benchmarks, and actionable insights. Built with Python and FastAPI.",
      es: "Ingresa datos de tu negocio y obtén un análisis completo con métricas, benchmarks e insights accionables. Construido con Python y FastAPI.",
    },
    tags: ["Python", "FastAPI", "Pydantic", "Recharts"],
    slug: "business-analysis",
    wip: false,
  },
  {
    title: {
      en: "Argentine Political Sentiment Analysis",
      es: "Análisis de Sentimiento Político Argentino"
    },
    description: {
      en: "Real-time analysis of Argentine political sentiment from Reddit with language models, VADER, and FastAPI.",
      es: "Análisis en tiempo real del sentimiento político argentino en Reddit con modelos de lenguaje, VADER y FastAPI."
    },
    tags: ["Python", "FastAPI", "NLP", "VADER", "Reddit API", "SQLAlchemy"],
    slug: "sentiment-analysis",
    wip: false,
  },
  {
    title: {
      en: "Argentine Inflation Tracker",
      es: "Rastreador de Inflación Argentina"
    },
    description: {
      en: "Track inflation and convert prices across 30 years of Argentine economic history. Using official data from FRED and OECD sources.",
      es: "Rastrea la inflación y convierte precios a través de 30 años de historia económica argentina. Utilizando datos oficiales de FRED y OECD.",
    },
    tags: ["Python", "FastAPI", "FRED API", "SQLAlchemy", "Recharts"],
    slug: "inflation-tracker",
    wip: false,
  },
  {
    title: {
      en: "Football Match Predictor",
      es: "Predictor de Partidos de Fútbol"
    },
    description: {
      en: "Predict match outcomes using machine learning models trained on Argentine Primera División data. Built with Python, FastAPI, and scikit-learn.",
      es: "Predice resultados de partidos usando modelos de aprendizaje automático entrenados con datos de la Primera División Argentina. Construido con Python, FastAPI y scikit-learn.",
    },
    tags: ["Python", "FastAPI", "scikit-learn", "Machine Learning"],
    slug: "match-predictor",
    wip: false,
  },
  {
    title: {
      en: "Agricultural Commodity Price Forecasting",
      es: "Pronóstico de Precios de Commodities Agrícolas"
    },
    description: {
      en: "Multi-variate time series forecasting for Argentine agricultural exports (soy, wheat, corn) using LSTM/Prophet models. Incorporates weather data, global market indicators, and seasonal patterns. Features confidence intervals and scenario analysis for farmers and exporters.",
      es: "Pronóstico de series temporales multivariadas para exportaciones agrícolas argentinas (soja, trigo, maíz) usando modelos LSTM/Prophet. Incorpora datos meteorológicos, indicadores del mercado global y patrones estacionales. Incluye intervalos de confianza y análisis de escenarios para agricultores y exportadores.",
    },
    tags: ["Python", "LSTM", "Prophet", "Time Series", "Forecasting"],
    slug: "agricultural-commodity-forecasting",
    wip: false,
  },
  {
    title: {
      en: "Argentine Wine Recommendation Engine",
      es: "Motor de Recomendación de Vinos Argentinos"
    },
    description: {
      en: "Personalized wine recommendations using collaborative filtering and content-based algorithms. Analyzes user preferences, regional characteristics, and tasting profiles from Mendoza and other Argentine wine regions. Built with surprise/scikit-learn and includes a user preference learning system.",
      es: "Recomendaciones personalizadas de vinos usando filtrado colaborativo y algoritmos basados en contenido. Analiza preferencias de usuarios, características regionales y perfiles de degustación de Mendoza y otras regiones vitivinícolas argentinas. Construido con surprise/scikit-learn e incluye un sistema de aprendizaje de preferencias de usuarios.",
    },
    tags: ["Python", "scikit-learn", "surprise", "Machine Learning", "Recommendation Systems"],
    slug: "wine-recommendation-engine",
    wip: true,
  },
]

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const [imageError, setImageError] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)

  const t = translations[language]

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundColor: `rgb(var(--background))` }} />
        <div className="absolute inset-0">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0,0 Q 30,40 0,80 L 0,100 L 100,100 L 100,0 Z" fill={`rgb(var(--accent))`} />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-card/80 backdrop-blur-md">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#C1D3FE] dark:hover:bg-[#495057] rounded-md px-3 py-1.5"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#C1D3FE] dark:hover:bg-[#495057] rounded-md px-3 py-1.5"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#C1D3FE] dark:hover:bg-[#495057] rounded-md px-3 py-1.5"
            >
              {t.nav.contact}
            </button>
          </div>

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
      </div>

      <section id="about" className="relative pt-32 pb-0" style={{ backgroundColor: `rgb(var(--background))` }}>
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 h-full w-2/5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20,0 Q 10,30 15,60 Q 18,80 10,100 L 100,100 L 100,0 Z" fill={`rgb(var(--accent))`} />
          </svg>
        </div>
        <div className="container relative mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <p
                className="mb-2 text-xs sm:text-sm font-medium uppercase tracking-wider"
                style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--muted-foreground))` }}
              >
                {t.hero.greeting}
              </p>
              <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : undefined }}>
                {t.hero.name}
              </h1>
              <p className="mb-6 text-lg sm:text-xl" style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--muted-foreground))` }}>
                {t.hero.title}
              </p>
              <div className="max-h-32 sm:max-h-40 overflow-y-auto sm:overflow-y-hidden pr-2">
                <p
                  className="text-sm sm:text-base text-pretty leading-relaxed"
                  style={{ color: theme === "dark" ? `rgb(255, 255, 255)` : `rgb(var(--muted-foreground))` }}
                >
                  {t.hero.description}
                </p>
              </div>
            </div>

            <div className="relative flex items-end justify-center" style={{ marginBottom: 0, paddingBottom: 0, alignSelf: 'flex-end' }}>
              <div className="relative h-80 w-80 sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem] xl:h-[32rem] xl:w-[32rem]" style={{ marginBottom: 0, paddingBottom: 0 }}>
                {/* Decorative circles */}
                <div className="absolute inset-0 rounded-full border-2 border-black" />
                <div className="absolute inset-8 rounded-full border border-black" />
                <div
                  className="absolute inset-16 rounded-full"
                  style={{ backgroundColor: `rgb(var(--muted) / 0.2)` }}
                />
                
                {/* Profile image or fallback decorative squares */}
                {!imageError ? (
                  <div 
                    className="absolute left-1/2 -translate-x-1/2" 
                    style={{ 
                      bottom: 0,
                      width: '70%',
                      height: '95%',
                    }}
                  >
                    <div className="relative h-full w-full" style={{ transform: 'scale(1.3)', transformOrigin: 'center bottom' }}>
                      <Image
                        src="/profile-silhouette.png"
                        alt="Rodri"
                        fill
                        className="object-contain object-bottom dark:drop-shadow-2xl dark:opacity-95"
                        onError={() => setImageError(true)}
                        priority
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-black rotate-12"
                      style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                    />
                    <div
                      className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black -rotate-6"
                      style={{ backgroundColor: `rgb(var(--primary) / 0.1)` }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="relative py-24 border-t border-black"
        style={{ backgroundColor: `rgb(var(--background))` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute left-0 h-full w-1/3" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0,0 L 0,100 Q 40,85 60,70 Q 75,60 80,40 Q 85,20 90,0 Z" fill={`rgb(var(--accent))`} />
          </svg>
        </div>
        <div className="container relative mx-auto px-6">
          <h2 className="mb-12 text-center text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {t.projects.title}
          </h2>
          <ProjectCarousel projects={projects} language={language} viewProjectText={t.projects.viewProject} />
        </div>
      </section>

      <section
        id="contact"
        className="relative py-24 border-t border-black"
        style={{ backgroundColor: `rgb(var(--background))` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 h-full w-2/5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 25,0 Q 18,35 22,65 Q 24,85 18,100 L 100,100 L 100,0 Z" fill={`rgb(var(--accent))`} />
          </svg>
        </div>
        <div className="container relative mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-center text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              {t.contact.title}
            </h2>
            <p
              className="mb-12 text-center text-sm sm:text-base text-pretty"
              style={{ color: `rgb(var(--muted-foreground))` }}
            >
              {t.contact.description}
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <Card 
                className="group relative overflow-hidden border-2 border-black transition-all hover:shadow-lg cursor-pointer"
                onClick={() => {
                  // Format phone number for WhatsApp (remove spaces and dashes)
                  const phoneNumber = '+5493512122621';
                  window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener,noreferrer');
                }}
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full"
                  style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                />
                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: `rgb(var(--primary))` }} />
                      <p
                        className="text-xs sm:text-sm font-medium uppercase tracking-wider"
                        style={{ color: `rgb(var(--muted-foreground))` }}
                      >
                        {t.contact.phone}
                      </p>
                    </div>
                    <p className="font-mono text-base sm:text-lg">+54 9 351 212-2621</p>
                    <p 
                      className="text-xs opacity-60"
                      style={{ color: `rgb(var(--muted-foreground))` }}
                    >
                      {t.contact.phoneHint}
                    </p>
                  </div>
                </div>
              </Card>

              <Card 
                className={`group relative overflow-hidden border-2 border-black transition-all duration-300 hover:shadow-lg ${
                  isEmailDialogOpen ? 'md:col-span-2' : ''
                }`}
              >
                {!isEmailDialogOpen ? (
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setIsEmailDialogOpen(true)}
                  >
                    <div
                      className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full"
                      style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                    />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: `rgb(var(--primary))` }} />
                        <p
                          className="text-xs sm:text-sm font-medium uppercase tracking-wider"
                          style={{ color: `rgb(var(--muted-foreground))` }}
                        >
                          {t.contact.email}
                        </p>
                      </div>
                      <p className="font-mono text-base sm:text-lg">rodri.perezz.dev@gmail.com</p>
                      <p 
                        className="text-xs opacity-60"
                        style={{ color: `rgb(var(--muted-foreground))` }}
                      >
                        {t.contact.emailHint}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: `rgb(var(--primary))` }} />
                        <h3 className="text-lg sm:text-xl font-bold">{t.contact.form.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEmailDialogOpen(false)}
                        className="h-8 w-8 rounded-full border-2 border-black dark:border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ContactForm 
                      translations={t.contact.form} 
                      onClose={() => setIsEmailDialogOpen(false)}
                      theme={theme}
                    />
                  </div>
                )}
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p
                className="mb-6 text-sm font-medium uppercase tracking-wider"
                style={{ color: `rgb(var(--muted-foreground))` }}
              >
                {t.contact.socials}
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-transparent border-2 border-black hover:shadow-md"
                  asChild
                >
                  <a href="https://github.com/rodriperezdev" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <GithubIcon className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-transparent border-2 border-black hover:shadow-md"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/rodri-perez/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 border-t border-black" style={{ backgroundColor: `rgb(var(--accent))` }}>
        <div className="container mx-auto px-6">
          <div
            className="flex flex-col items-center justify-between gap-4 text-center text-sm md:flex-row md:text-left"
            style={{ color: `rgb(var(--muted-foreground))` }}
          >
            <p>
              © 2025 Rodrigo Pérez. {t.footer.rights}
            </p>
            <p>
              {t.footer.message}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
