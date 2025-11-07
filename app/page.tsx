"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Github, Linkedin, Mail, Phone } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { ProjectCarousel } from "@/components/project-carousel"
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
        "I'm a developer based in Argentina. I specialize in Python and its web frameworks, database management, and RESTful API development. I also have knowledge on data science libraries to turn raw data into useful insights for your business. I'm a quick learner, always exploring new technologies.",
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
      email: "Email",
      socials: "Find me on",
    },
    footer: {
      rights: "All rights reserved.",
      crafted: "Crafted with precision by",
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
        "Soy un desarrollador basado en Argentina, me especializo en Python y sus frameworks web, gestión de bases de datos y desarrollo de APIs RESTful. También tengo conocimiento en librerías de ciencia de datos para convertir datos en bruto en información útil para tu negocio. Aprendo rápido y siempre estoy explorando nuevas tecnologías para dominar.",
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
      email: "Correo",
      socials: "Encuéntrame en",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      crafted: "Creado con precisión por",
    },
  },
}

const projects = [
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
    tags: ["Python", "FastAPI", "FRED API", "SQLAlchemy", "Next.js", "Recharts"],
    slug: "inflation-tracker",
  },
  {
    title: {
      en: "Football Match Predictor",
      es: "Predictor de Partidos de Fútbol"
    },
    description: {
      en: "Predict match outcomes using machine learning models trained on Argentine Primera División data. Built with Python, FastAPI, scikit-learn, and XGBoost.",
      es: "Predice resultados de partidos usando modelos de aprendizaje automático entrenados con datos de la Primera División Argentina. Construido con Python, FastAPI, scikit-learn y XGBoost.",
    },
    tags: ["Python", "FastAPI", "scikit-learn", "XGBoost", "Machine Learning", "Next.js"],
    slug: "match-predictor",
  },
  {
    title: {
      en: "Predictive Maintenance System",
      es: "Sistema de Mantenimiento Predictivo"
    },
    description: {
      en: "IoT-based predictive maintenance system using time-series analysis and neural networks to forecast equipment failures.",
      es: "Sistema de mantenimiento predictivo basado en IoT usando análisis de series temporales y redes neuronales para predecir fallas de equipos.",
    },
    tags: ["Python", "PyTorch", "TimescaleDB", "MQTT"],
    slug: "predictive-maintenance-system",
  },
  {
    title: {
      en: "Distributed Data Processor",
      es: "Procesador de Datos Distribuido"
    },
    description: {
      en: "Scalable data processing framework handling petabytes of data using Apache Spark and Kubernetes orchestration.",
      es: "Framework de procesamiento de datos escalable manejando petabytes de datos usando Apache Spark y orquestación con Kubernetes.",
    },
    tags: ["Spark", "Kubernetes", "Scala", "Kafka"],
    slug: "distributed-data-processor",
  },
]

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

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
              className="text-sm font-medium transition-colors hover:opacity-70"
            >
              {t.nav.about}
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm font-medium transition-colors hover:opacity-70"
            >
              {t.nav.projects}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium transition-colors hover:opacity-70"
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

      <section id="about" className="relative pt-32 pb-24" style={{ backgroundColor: `rgb(var(--background))` }}>
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
                style={{ color: `rgb(var(--muted-foreground))` }}
              >
                {t.hero.greeting}
              </p>
              <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                {t.hero.name}
              </h1>
              <p className="mb-6 text-lg sm:text-xl" style={{ color: `rgb(var(--muted-foreground))` }}>
                {t.hero.title}
              </p>
              <div className="max-h-32 sm:max-h-40 overflow-y-auto sm:overflow-y-hidden pr-2">
                <p
                  className="text-sm sm:text-base text-pretty leading-relaxed"
                  style={{ color: `rgb(var(--muted-foreground))` }}
                >
                  {t.hero.description}
                </p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                <div className="absolute inset-0 rounded-full border-2 border-black" />
                <div className="absolute inset-8 rounded-full border border-black" />
                <div
                  className="absolute inset-16 rounded-full"
                  style={{ backgroundColor: `rgb(var(--muted) / 0.2)` }}
                />
                <div
                  className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-black rotate-12"
                  style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                />
                <div
                  className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black -rotate-6"
                  style={{ backgroundColor: `rgb(var(--primary) / 0.1)` }}
                />
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
              <Card className="group relative overflow-hidden border-2 border-black p-6 transition-all hover:shadow-lg">
                <div
                  className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full"
                  style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                />
                <Phone className="mb-4 h-5 w-5 sm:h-6 sm:w-6" style={{ color: `rgb(var(--primary))` }} />
                <p
                  className="mb-2 text-xs sm:text-sm font-medium uppercase tracking-wider"
                  style={{ color: `rgb(var(--muted-foreground))` }}
                >
                  {t.contact.phone}
                </p>
                <p className="font-mono text-base sm:text-lg">+1 (555) 123-4567</p>
              </Card>

              <Card className="group relative overflow-hidden border-2 border-black p-6 transition-all hover:shadow-lg">
                <div
                  className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full"
                  style={{ backgroundColor: `rgb(var(--primary) / 0.05)` }}
                />
                <Mail className="mb-4 h-5 w-5 sm:h-6 sm:w-6" style={{ color: `rgb(var(--primary))` }} />
                <p
                  className="mb-2 text-xs sm:text-sm font-medium uppercase tracking-wider"
                  style={{ color: `rgb(var(--muted-foreground))` }}
                >
                  {t.contact.email}
                </p>
                <p className="font-mono text-base sm:text-lg">hello@example.com</p>
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
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-transparent border-2 border-black hover:shadow-md"
                  asChild
                >
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
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
              © 2025 {t.hero.name}. {t.footer.rights}
            </p>
            <p>
              {t.footer.crafted} {t.hero.name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
