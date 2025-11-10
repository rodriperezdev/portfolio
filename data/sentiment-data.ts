// Political Events for sentiment analysis correlation
export const politicalEvents = [
  {
    date: "2025-10-26",
    label: {
      en: "2024 Legislative Elections",
      es: "Elecciones Legislativas 2024"
    }
  },
  {
    date: "2025-09-07", 
    label: {
      en: "Bs.As. Provincial Elections",
      es: "Elecciones Provinciales de Bs.As."
    }
  },
  {
    date: "2025-10-09",
    label: {
      en: "U.S Currency Swap Announcement", 
      es: "Anuncio de Swap de Monedas con EE.UU."
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




