'use client';

import { useState, useEffect } from 'react';

export function useTheme() {
  // Always initialize with 'light' to prevent hydration mismatch
  // The actual theme will be set in useEffect on client side
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);
    
    // Check localStorage first (script already applied it to DOM)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      // Ensure DOM matches localStorage (script should have done this, but ensure consistency)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Default to light mode (script should have already set this)
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  // Return default theme until mounted to prevent hydration mismatch
  return { theme: mounted ? theme : 'light', toggleTheme };
}


