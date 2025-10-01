import { createContext, useContext, useEffect, useState } from "react";
import { themes, ThemeKey } from "@/lib/themes";

type Mode = "dark" | "light";

type EnhancedThemeProviderProps = {
  children: React.ReactNode;
};

type EnhancedThemeProviderState = {
  themeKey: ThemeKey;
  mode: Mode;
  setThemeKey: (key: ThemeKey) => void;
  setMode: (mode: Mode) => void;
  currentColors: typeof themes.theme1.colors;
};

const EnhancedThemeProviderContext = createContext<EnhancedThemeProviderState | undefined>(undefined);

export function EnhancedThemeProvider({ children }: EnhancedThemeProviderProps) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(
    () => (localStorage.getItem("theme-key") as ThemeKey) || "theme1"
  );
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem("theme-mode") as Mode) || "dark"
  );

  const currentColors = themes[themeKey].colors;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    
    // Apply theme colors to custom properties
    root.style.setProperty('--theme-primary', currentColors.primary);
    root.style.setProperty('--theme-primary-light', currentColors.primaryLight);
    root.style.setProperty('--theme-primary-dark', currentColors.primaryDark);
    root.style.setProperty('--theme-secondary', currentColors.secondary);
    root.style.setProperty('--theme-accent', currentColors.accent);
    root.style.setProperty('--theme-dark', currentColors.dark);
    
    // Convert primary color to RGB for use in rgba()
    const hexToRGB = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };
    root.style.setProperty('--theme-primary-rgb', hexToRGB(currentColors.primary));
    
    // Map theme colors to shadcn/Tailwind CSS variables
    const hexToHSL = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Update shadcn variables based on current theme
    root.style.setProperty('--primary', hexToHSL(currentColors.primary));
    root.style.setProperty('--primary-foreground', mode === 'dark' ? '0 0% 98%' : '0 0% 10%');
    root.style.setProperty('--secondary', hexToHSL(currentColors.secondary));
    root.style.setProperty('--accent', hexToHSL(currentColors.accent));
    root.style.setProperty('--ring', hexToHSL(currentColors.primary));
    
    localStorage.setItem("theme-key", themeKey);
    localStorage.setItem("theme-mode", mode);
  }, [themeKey, mode, currentColors]);

  return (
    <EnhancedThemeProviderContext.Provider value={{ themeKey, mode, setThemeKey, setMode, currentColors }}>
      {children}
    </EnhancedThemeProviderContext.Provider>
  );
}

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeProviderContext);
  if (context === undefined) {
    throw new Error("useEnhancedTheme must be used within an EnhancedThemeProvider");
  }
  return context;
};
