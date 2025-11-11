"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Project {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  tags: string[]
  slug: string
  wip?: boolean
}

interface ProjectCarouselProps {
  projects: Project[]
  language: "en" | "es"
  viewProjectText: string
}

export function ProjectCarousel({ projects, language, viewProjectText }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setTranslateX(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50 // minimum drag distance to trigger slide change
    if (translateX > threshold) {
      prevProject()
    } else if (translateX < -threshold) {
      nextProject()
    }
    setTranslateX(0)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  return (
    <div className="relative mx-auto max-w-4xl">
      <div
        ref={carouselRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            transition: isDragging ? "none" : "transform 0.5s ease-out",
          }}
        >
          {projects.map((project, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <Card className="group relative overflow-hidden border-2 border-gray-300 dark:border-gray-800 dark:bg-[#1E1E1E] bg-[#ABC4FF] rounded-2xl p-6 sm:p-8 transition-all hover:border-primary/50 shadow-xl">
                {/* Decorative geometric element */}
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rotate-45 bg-muted/50" />

                <div className="relative">
                  <h3 className="mb-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {project.title[language]}
                    {project.wip && (
                      <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">(W.I.P)</span>
                    )}
                  </h3>
                  <div className="mb-6 max-h-24 sm:max-h-32 overflow-y-auto sm:overflow-y-hidden pr-2">
                    <p className="text-sm sm:text-base text-pretty leading-relaxed text-gray-700 dark:text-gray-300">
                      {project.description[language]}
                    </p>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.wip ? (
                    <Button
                      variant="outline"
                      disabled
                      className="border-2 border-gray-400 dark:border-gray-600 text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60 text-sm sm:text-base font-medium"
                    >
                      {viewProjectText}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="group/btn border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-500 bg-white dark:bg-transparent hover:bg-green-600 dark:hover:bg-green-600 hover:border-green-600 dark:hover:border-green-600 hover:text-white dark:hover:text-white text-sm sm:text-base font-medium transition-all duration-200"
                      asChild
                    >
                      <Link href={`/project/${project.slug}`}>
                        {viewProjectText}
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevProject}
          className="h-10 w-10 rounded-full bg-transparent border-black dark:border-white/20 hover:border-black/60 dark:hover:border-white/40 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Previous project"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to project ${index + 1}`}
              className="group relative cursor-pointer"
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-black dark:bg-white"
                    : "w-5 bg-black/30 dark:bg-white/40 group-hover:bg-black/60 dark:group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextProject}
          className="h-10 w-10 rounded-full bg-transparent border-black dark:border-white/20 hover:border-black/60 dark:hover:border-white/40 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Next project"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
