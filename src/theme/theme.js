import { createTheme } from '@mui/material/styles';
import tokens from './tokens';
import componentsOverrides from './components-overrides';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: tokens.palette.primary,
    secondary: tokens.palette.secondary,
    background: tokens.palette.background,
    success: tokens.palette.success,
    error: tokens.palette.error,
    warning: tokens.palette.warning,
    text: tokens.palette.text,
  },
  shape: {
    borderRadius: tokens.shape.borderRadius,
  },
  spacing: tokens.spacing,
  shadows: tokens.shadows,
  typography: tokens.typography,
});

theme.components = componentsOverrides(theme);

export default theme;
