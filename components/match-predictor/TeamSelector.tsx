'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface TeamSelectorProps {
  teams: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

export function TeamSelector({ teams, value, onChange, label, placeholder }: TeamSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) {
      return teams;
    }
    const query = searchQuery.toLowerCase();
    return teams.filter((team) => team.toLowerCase().includes(query));
  }, [teams, searchQuery]);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure the dropdown is fully rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSelectChange = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpenChange = (open: boolean) => {
    // Keep open if search input is focused
    if (!open && document.activeElement === searchInputRef.current) {
      // Don't close if user is typing
      return;
    }
    setIsOpen(open);
  };

  const handleEnterKey = () => {
    // If only one team matches, select it automatically
    if (filteredTeams.length === 1) {
      handleSelectChange(filteredTeams[0]);
    } else if (filteredTeams.length > 1 && searchQuery.trim()) {
      // If multiple teams match but one starts with the query, select it
      const exactMatch = filteredTeams.find(team => 
        team.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      if (exactMatch) {
        handleSelectChange(exactMatch);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm opacity-60">{label}</Label>
      <Select value={value} onValueChange={handleSelectChange} open={isOpen} onOpenChange={handleOpenChange}>
        <SelectTrigger className="w-full border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]/40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          className="max-h-[300px]"
          onEscapeKeyDown={(e) => {
            // Allow escape to close
            setIsOpen(false);
          }}
        >
          <div 
            className="sticky top-0 z-10 bg-[rgb(var(--background))] border-b border-[rgb(var(--foreground))]/10 p-2"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--foreground))]/40" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => {
                  e.stopPropagation();
                  setSearchQuery(e.target.value);
                  // Keep dropdown open when typing
                  if (!isOpen) {
                    setIsOpen(true);
                  }
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="pl-8 w-full border border-[rgb(var(--foreground))]/20 rounded-lg bg-[rgb(var(--background))] text-[rgb(var(--foreground))] focus:outline-none focus:border-[rgb(var(--foreground))]/40"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  // Handle Enter key for autocomplete
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEnterKey();
                  }
                  // Allow Escape to close
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setSearchQuery('');
                  }
                  // Arrow down to focus first item
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    // Focus first team item if available
                    const firstItem = document.querySelector('[role="option"]') as HTMLElement;
                    if (firstItem) {
                      firstItem.focus();
                    }
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-6 text-center text-sm text-[rgb(var(--foreground))]/60">
                No teams found
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

