'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MegaCategory, MoodType, MegaCategoryTheme } from '@/types';
import { CATEGORIES } from '@/data/categories';

interface ThemeContextType {
  activeCategory: MegaCategory;
  setActiveCategory: (cat: MegaCategory) => void;
  currentTheme: MegaCategoryTheme;
  activeMood: MoodType;
  setActiveMood: (mood: MoodType) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<MegaCategory>('clips-clutches');
  const [activeMood, setActiveMood] = useState<MoodType>('minimal');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const currentTheme =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  // Apply CSS variables dynamically to document root whenever theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--theme-bg', currentTheme.bgLight);
      root.style.setProperty('--theme-accent', currentTheme.accent);
      root.style.setProperty('--theme-accent-soft', currentTheme.accentSoft);
      root.style.setProperty('--theme-text', currentTheme.textColor);
      root.style.setProperty('--theme-text-muted', currentTheme.textMuted);
    }
  }, [currentTheme]);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        currentTheme,
        activeMood,
        setActiveMood,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
