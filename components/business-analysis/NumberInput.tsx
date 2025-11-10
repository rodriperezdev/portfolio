'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'onBlur'> {
  value: number | '';
  onChange: (value: number | '') => void;
  allowDecimals?: boolean;
  onBlur?: () => void;
}

export function NumberInput({ 
  value, 
  onChange, 
  allowDecimals = false,
  className,
  onBlur: customOnBlur,
  ...props 
}: NumberInputProps) {
  const formatValue = (val: number | ''): string => {
    if (val === '' || val === 0) return '';
    if (allowDecimals) {
      return val.toString();
    }
    return Math.floor(val).toString();
  };

  // Local state to track the input value for immediate updates
  const [localValue, setLocalValue] = useState<string>(formatValue(value));
  const isInternalChange = useRef(false);

  // Sync local state with prop value when it changes externally
  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalValue(formatValue(value));
    }
    isInternalChange.current = false;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Mark this as an internal change to prevent sync
    isInternalChange.current = true;
    
    // Update local state immediately for responsive UI
    setLocalValue(inputValue);
    
    // Allow empty input
    if (inputValue === '') {
      onChange('');
      return;
    }

    // Remove any non-numeric characters except decimal point
    const cleaned = allowDecimals 
      ? inputValue.replace(/[^\d.]/g, '')
      : inputValue.replace(/[^\d]/g, '');
    
    // Prevent multiple decimal points
    if (allowDecimals) {
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        return;
      }
    }

    // Convert to number
    const numValue = allowDecimals ? parseFloat(cleaned) : parseInt(cleaned, 10);
    
    if (!isNaN(numValue)) {
      onChange(numValue);
    } else if (cleaned === '') {
      // If cleaned is empty after removing non-numeric chars, allow empty
      onChange('');
    }
  };

  const handleBlur = () => {
    // If custom onBlur is provided, use it
    if (customOnBlur) {
      customOnBlur();
      return;
    }
    // Default behavior: ensure value is not empty string when blurred
    if (value === '') {
      onChange(0);
    }
  };

  return (
    <Input
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={cn('text-base', className)}
      {...props}
    />
  );
}

