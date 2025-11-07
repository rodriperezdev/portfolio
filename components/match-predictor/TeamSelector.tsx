'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TeamSelectorProps {
  teams: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export function TeamSelector({ teams, value, onChange, label, placeholder }: TeamSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm opacity-60">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]/40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

