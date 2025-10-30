export const blogFiltersStyles = {
  container: {
    width: "100%",
    p: 2.5,
    bgcolor: "background.paper",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
  },

  searchField: {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
    "& .MuiInputAdornment-root": {
      color: "primary.main",
    },
  },

  dateField: {
    minWidth: 180,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
  },

  clearButton: {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 600,
    textTransform: "none",
    borderColor: "secondary.main",
    color: "secondary.main",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(112, 39, 160, 0.08)",
      borderColor: "secondary.dark",
      transform: "translateY(-1px)",
    },
  },
};
