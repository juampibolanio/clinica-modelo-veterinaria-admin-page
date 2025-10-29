import { createTheme } from '@mui/material/styles';
import tokens from './tokens';
import componentsOverrides from './components-overrides';

/**
 * Creates and exports the MUI theme for the application.
 * @return {object} The MUI theme object.
 */
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
