"use client"

import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  language: "en" | "es"
  onToggle: () => void
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-14 rounded-md p-0.5 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle language"
      onClick={onToggle}
    >
      <svg viewBox="0 0 60 40" className="h-full w-full transition-transform duration-200">
        <defs>
          {/* Clip path for UK flag (top-left triangle) */}
          <clipPath id="uk-clip">
            <polygon points="0,0 60,0 0,40" />
          </clipPath>
          {/* Clip path for Spain flag (bottom-right triangle) */}
          <clipPath id="spain-clip">
            <polygon points="60,0 60,40 0,40" />
          </clipPath>
        </defs>

        {/* UK Flag (top-left half) */}
        <g clipPath="url(#uk-clip)">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
          <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="13" />
          <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="8" />
        </g>

        {/* Spain Flag (bottom-right half) */}
        <g clipPath="url(#spain-clip)">
          <rect width="60" height="40" fill="#AA151B" />
          <rect y="10" width="60" height="20" fill="#F1BF00" />
        </g>

        {/* Diagonal dividing line */}
        <line x1="0" y1="40" x2="60" y2="0" stroke="#000" strokeWidth="1.5" opacity="0.3" />
      </svg>
    </Button>
  )
}
