import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Business Analytics | Portfolio | Pérez Rodrigo",
  description: "Input business data and get comprehensive analysis with metrics, benchmarks, and actionable insights. Built with Python and FastAPI.",
}

export default function BusinessAnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



