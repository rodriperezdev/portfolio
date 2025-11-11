"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Sun, Moon } from "lucide-react"
import Link from "next/link"
import { LanguageToggle } from "@/components/language-toggle"
import { useTheme } from "@/hooks/useTheme"
import { useLanguage } from "@/hooks/useLanguage"

const translations = {
  en: {
    backToPortfolio: "Back to Portfolio",
    overview: "Overview",
    keyFeatures: "Key Features",
    technologies: "Technologies Used",
    viewOnGithub: "View on GitHub",
    liveDemo: "Live Demo",
    footer: {
      rights: "All rights reserved.",
      message: "If you have any questions or ideas for any of my projects feel free to contact me!",
    },
  },
  es: {
    backToPortfolio: "Volver al Portafolio",
    overview: "Descripción General",
    keyFeatures: "Características Principales",
    technologies: "Tecnologías Utilizadas",
    viewOnGithub: "Ver en GitHub",
    liveDemo: "Demo en Vivo",
    footer: {
      rights: "Todos los derechos reservados.",
      message: "Si tienes alguna pregunta o idea para cualquiera de mis proyectos, no dudes en contactarme!",
    },
  },
}

export function ProjectPageClient({ project, slug }: { project: any; slug: string }) {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

  const t = translations[language]

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ backgroundColor: `rgb(var(--background))` }} />
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 h-full w-2/5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20,0 Q 10,30 15,60 Q 18,80 10,100 L 100,100 L 100,0 Z" fill={`rgb(var(--accent))`} />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-black bg-card/80 backdrop-blur-md">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2 text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              {t.backToPortfolio}
            </Link>
          </Button>

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

      {/* Main Content */}
      <main className="container relative mx-auto px-6 pt-32 pb-24">
        <div className="relative mx-auto max-w-4xl">
          {/* Project Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{typeof project.title === 'object' ? project.title[language] : project.title}</h1>
            <p className="text-lg sm:text-xl text-pretty text-muted-foreground">{project.description[language]}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border-2 border-black bg-muted/50 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Overview Section */}
          <Card className="mb-8 border-2 border-black p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">{t.overview}</h2>
              {project.demo && (
                <Button size="lg" variant="outline" className="border-2 border-red-600 dark:border-red-500 text-red-700 dark:text-red-500 bg-white dark:bg-transparent hover:bg-red-600 dark:hover:bg-red-600 hover:border-red-600 dark:hover:border-red-600 hover:text-white dark:hover:text-white text-sm sm:text-base font-medium transition-all duration-200" asChild>
                  <a href={project.demo} className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    {t.liveDemo}
                  </a>
                </Button>
              )}
            </div>
            <div className="max-h-40 sm:max-h-48 overflow-y-auto sm:overflow-y-hidden pr-2">
              <p className="text-sm sm:text-base text-pretty leading-relaxed text-muted-foreground">
                {project.fullDescription[language]}
              </p>
            </div>
          </Card>

          {/* Key Features */}
          <Card className="mb-8 border-2 border-black p-6 sm:p-8">
            <h2 className="mb-6 text-xl sm:text-2xl font-bold">{t.keyFeatures}</h2>
            <div className="max-h-48 sm:max-h-64 overflow-y-auto sm:overflow-y-hidden pr-2">
              <ul className="space-y-3">
                {project.features[language].map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-sm sm:text-base text-pretty leading-relaxed text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Technologies */}
          <Card className="mb-8 border-2 border-black p-6 sm:p-8">
            <h2 className="mb-6 text-xl sm:text-2xl font-bold">{t.technologies}</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {project.technologies.map((tech: string) => (
                <div
                  key={tech}
                  className="rounded-lg border-2 border-black bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 text-center"
                >
                  <span className="text-sm sm:text-base font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button size="lg" className="border-black text-sm sm:text-base cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                <Github className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                {t.viewOnGithub}
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 border-t border-black" style={{ backgroundColor: `rgb(var(--accent))` }}>
        <div className="container mx-auto px-6">
          <div
            className="flex flex-col items-center justify-between gap-4 text-center text-sm md:flex-row md:text-left"
            style={{ color: `rgb(var(--muted-foreground))` }}
          >
            <p>© 2025 Rodrigo Pérez. {t.footer.rights}</p>
            <p>{t.footer.message}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


