import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Project Details | Portfolio | Pérez Rodrigo",
  description: "Detailed information about the project including features, technologies, and implementation details",
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



