'use client';

import { Language } from '@/data/translations';

interface DataQualityNoticeProps {
  language: Language;
  translations: any;
}

export function DataQualityNotice({ language, translations: t }: DataQualityNoticeProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Data Integrity Disclaimer */}
      <div className="border border-[rgb(var(--foreground))]/10 rounded-2xl p-6 bg-[rgb(var(--card))] shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="text-amber-500">⚠️</span>
          {t.dataIntegrityDisclaimerTitle}
        </h3>
        <p className="text-sm opacity-80 leading-relaxed">
          {t.dataIntegrityDisclaimer}
        </p>
      </div>
    </div>
  );
}


