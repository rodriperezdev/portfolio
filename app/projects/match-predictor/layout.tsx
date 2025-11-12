import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Match Predictor | Portfolio | Pérez Rodrigo",
  description: "Predict football match outcomes using machine learning models trained on Argentine Primera División data. Built with Python, FastAPI, and scikit-learn.",
}

export default function MatchPredictorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

