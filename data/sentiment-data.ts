// Political Events for sentiment analysis correlation
export const politicalEvents = [
  {
    date: "2024-12-10",
    label: {
      en: "Milei First Year Anniversary",
      es: "Aniversario del Primer Año de Milei"
    }
  },
  {
    date: "2024-12-12",
    label: {
      en: "Fiscal Surplus Announcement",
      es: "Anuncio de Superávit Fiscal"
    }
  },
  {
    date: "2025-04-10",
    label: {
      en: "China Currency Swap Renewal ($5B)",
      es: "Renovación Swap de Monedas con China ($5B)"
    }
  },
  {
    date: "2025-04-11",
    label: {
      en: "IMF Loan Approval ($20B)",
      es: "Aprobación Préstamo FMI ($20B)"
    }
  },
  {
    date: "2025-09-07", 
    label: {
      en: "Buenos Aires Provincial Elections",
      es: "Elecciones Provinciales de Buenos Aires"
    }
  },
  {
    date: "2025-10-09",
    label: {
      en: "U.S. Currency Swap Announcement ($20B)", 
      es: "Anuncio de Swap con EE.UU. ($20B)"
    }
  },
  {
    date: "2025-10-26",
    label: {
      en: "National Legislative Elections",
      es: "Elecciones Legislativas Nacionales"
    }
  }
];

// Helper: Add new events easily
export function addPoliticalEvent(date: string, labelEn: string, labelEs: string) {
  return {
    date,
    label: {
      en: labelEn,
      es: labelEs
    }
  };
}







