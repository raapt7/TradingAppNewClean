import { TextStyle } from 'react-native';

type FontWeight = '400' | '500' | '600' | '700' | 'bold' | 'normal';

interface Typography {
  fontSize: number;
  fontWeight: FontWeight;
}

export const theme = {
  colors: {
    // Primary brand colors
    primary: '#2C3E50',  // Deep blue for headers
    secondary: '#3498DB', // Bright blue for actions
    accent: '#1ABC9C',   // Teal for highlights
    
    // Status colors
    success: '#2ECC71',  // Green for profits/buy
    warning: '#F1C40F',  // Yellow for alerts
    danger: '#E74C3C',   // Red for losses/sell
    
    // Background colors
    background: '#F8FAFC', // Light gray background
    surface: '#FFFFFF',    // White surface
    card: '#F0F4F8',      // Card background
    
    // Text colors
    text: '#2C3E50',      // Primary text
    textSecondary: '#7F8C8D', // Secondary text
    textLight: '#BDC3C7',    // Disabled text
    
    // Chart colors
    chartUp: '#2ECC71',   // Green for upward trends
    chartDown: '#E74C3C', // Red for downward trends
    chartLine: '#3498DB', // Blue for neutral lines
    
    // Border colors
    border: '#E2E8F0',    // Light border
    divider: '#EDF2F7'    // Subtle divider
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24
  },
  
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 'bold'
    } as Typography,
    h2: {
      fontSize: 24,
      fontWeight: 'bold'
    } as Typography,
    h3: {
      fontSize: 20,
      fontWeight: '600'
    } as Typography,
    body: {
      fontSize: 16,
      fontWeight: 'normal'
    } as Typography,
    caption: {
      fontSize: 14,
      fontWeight: 'normal'
    } as Typography,
    small: {
      fontSize: 12,
      fontWeight: 'normal'
    } as Typography
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)'
  }
} as const; 