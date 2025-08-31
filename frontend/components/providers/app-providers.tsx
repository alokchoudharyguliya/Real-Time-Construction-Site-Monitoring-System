'use client';

import { AuthContext, useAuthProvider } from '@/hooks/use-auth';
import { ThemeContext, useThemeProvider } from '@/hooks/use-theme';
import { LanguageContext, useLanguageProvider } from '@/hooks/use-language';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  const theme = useThemeProvider();
  const language = useLanguageProvider();

  return (
    <ThemeContext.Provider value={theme}>
      <LanguageContext.Provider value={language}>
        <AuthContext.Provider value={auth}>
          {children}
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}