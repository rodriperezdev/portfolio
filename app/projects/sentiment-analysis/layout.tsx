import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sentiment Analysis | Portfolio | Pérez Rodrigo",
  description: "Real-time sentiment analysis of Argentine political discussions from Reddit using NLP and machine learning",
}

export default function SentimentAnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



