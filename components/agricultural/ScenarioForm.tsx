'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { ScenarioParams } from '@/hooks/useAgriculturalData';

interface ScenarioFormProps {
  onRunScenario: (params: ScenarioParams) => void;
  loading: boolean;
  translations: any;
}

export function ScenarioForm({ onRunScenario, loading, translations: t }: ScenarioFormProps) {
  const [temperature, setTemperature] = useState<number>(0);
  const [precipitation, setPrecipitation] = useState<number>(0);

  const handleSubmit = () => {
    onRunScenario({
      temperature_change: temperature,
      precipitation_change: precipitation / 100, // Convert percentage to decimal
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t.scenarioAnalysis || 'Scenario Analysis'}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          {t.scenarioDescription || 'Adjust weather parameters to see how they might impact commodity prices.'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Temperature Change */}
        <div className="space-y-3">
          <Label htmlFor="temperature" className="text-sm font-medium">
            {t.temperatureChange || 'Temperature Change'}: {temperature > 0 ? '+' : ''}{temperature}°C
          </Label>
          <Slider
            id="temperature"
            min={-5}
            max={5}
            step={0.5}
            value={[temperature]}
            onValueChange={(value) => setTemperature(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-5°C</span>
            <span>0°C</span>
            <span>+5°C</span>
          </div>
        </div>

        {/* Precipitation Change */}
        <div className="space-y-3">
          <Label htmlFor="precipitation" className="text-sm font-medium">
            {t.precipitationChange || 'Precipitation Change'}: {precipitation > 0 ? '+' : ''}{precipitation}%
          </Label>
          <Slider
            id="precipitation"
            min={-50}
            max={50}
            step={5}
            value={[precipitation]}
            onValueChange={(value) => setPrecipitation(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="lg"
          className="w-full min-h-[44px] cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {loading ? (t.analyzing || 'Analyzing...') : (t.runScenario || 'Run Scenario')}
        </Button>
      </div>
    </div>
  );
}


