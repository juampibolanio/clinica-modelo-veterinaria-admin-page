/**
 * Styles for the ProductFilters component using MUI's sx prop format.
 */
export const productFiltersStyles = {
  container: {
    direction: { xs: "column", sm: "row" },
    spacing: 2,
    alignItems: { xs: "stretch", sm: "center" },
    flexWrap: "wrap",
    p: 3,
    bgcolor: "background.paper",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
  },

  searchField: {
    flex: { xs: "1 1 100%", sm: "1 1 220px" },
    minWidth: { xs: "100%", sm: "220px" },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "background.paper",
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
  },

  selectControl: {
    minWidth: { xs: "100%", sm: "200px" },
    flex: { xs: "1 1 100%", sm: "0 0 200px" },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "background.paper",
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
  },

  resetButton: {
    px: 3,
    py: 0.8,
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    borderWidth: "2px",
    borderColor: "secondary.main",
    color: "secondary.main",
    transition: "all 0.2s ease",
    minWidth: { xs: "100%", sm: "120px" },
    "&:hover": {
      bgcolor: "rgba(112, 39, 160, 0.08)",
      borderColor: "secondary.dark",
      borderWidth: "2px",
      transform: "translateY(-1px)",
    },
  },
};
