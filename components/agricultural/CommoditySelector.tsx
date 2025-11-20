'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CommoditySelectorProps {
  value: string;
  onChange: (value: string) => void;
  commodities: string[];
  translations: any;
  language: 'en' | 'es';
}

const commodityIcons: Record<string, string> = {
  soy: '🌱',
  wheat: '🌾',
  corn: '🌽',
};

export function CommoditySelector({ value, onChange, commodities, translations: t, language }: CommoditySelectorProps) {
  const getCommodityName = (commodity: string) => {
    // Use translated name from translations object
    const key = commodity as 'soy' | 'wheat' | 'corn';
    return t[key] || commodity;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="commodity" className="text-sm font-medium">
        {t.selectCommodity || 'Select Commodity'}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="commodity" className="w-full min-h-[44px]">
          <SelectValue placeholder={t.chooseCommodity || 'Choose a commodity'} />
        </SelectTrigger>
        <SelectContent>
          {commodities.map((commodity) => (
            <SelectItem key={commodity} value={commodity}>
              <span className="flex items-center gap-2">
                <span>{commodityIcons[commodity] || '📊'}</span>
                <span>{getCommodityName(commodity)}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


