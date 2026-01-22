import React from 'react';
import {ThemeProvider as StyledThemeProvider} from 'styled-components/native';
import {theme} from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  return (
    <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
  );
};
