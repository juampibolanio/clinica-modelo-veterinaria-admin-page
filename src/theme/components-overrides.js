/**
 * Overrides for MUI components to customize their styles.
 * @param {object} theme - The MUI theme object.
 * @return {object} The components overrides object.
 */
const componentsOverrides = (theme) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: "none",
        "&:hover": { boxShadow: "none", opacity: 0.95 }, 
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[2],
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": { borderRadius: theme.shape.borderRadius },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: { borderRadius: theme.shape.borderRadius },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: { boxShadow: theme.shadows[1] },
    },
  },
});
export default componentsOverrides;
