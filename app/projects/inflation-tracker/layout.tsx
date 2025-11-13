import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Inflation Tracker | Portfolio | Pérez Rodrigo",
  description: "Track inflation and convert prices across 30 years of Argentine economic history using official data from FRED and OECD sources",
}

export default function InflationTrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



