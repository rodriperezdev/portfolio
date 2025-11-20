'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ModelSelectorProps {
  value: 'prophet' | 'lstm';
  onChange: (value: 'prophet' | 'lstm') => void;
  translations: any;
}

export function ModelSelector({ value, onChange, translations: t }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t.selectModel || 'Select Model'}
      </Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log('Prophet clicked, current value:', value);
            onChange('prophet');
          }}
          className={`flex-1 min-h-[44px] cursor-pointer transition-all duration-200 ${
            value === 'prophet' 
              ? 'bg-black text-white border-black dark:bg-blue-600 dark:text-white dark:border-blue-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold">Prophet</span>
            <span className="text-xs opacity-70">{t.withConfidenceIntervals || 'With confidence intervals'}</span>
          </div>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log('LSTM clicked, current value:', value);
            onChange('lstm');
          }}
          className={`flex-1 min-h-[44px] cursor-pointer transition-all duration-200 ${
            value === 'lstm' 
              ? 'bg-black text-white border-black dark:bg-blue-600 dark:text-white dark:border-blue-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold">LSTM</span>
            <span className="text-xs opacity-70">{t.deepLearning || 'Deep learning'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}

