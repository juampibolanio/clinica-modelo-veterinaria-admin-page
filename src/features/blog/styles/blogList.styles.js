/**
 * Styles for the BlogList page component using MUI's sx prop format.
 */
export const blogListStyles = {
  container: {
    spacing: 3,
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.75rem", sm: "2rem" },
  },

  addButton: {
    px: 3,
    py: 1,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 4px 12px rgba(55, 129, 227, 0.3)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      boxShadow: "0 6px 20px rgba(55, 129, 227, 0.4)",
      transform: "translateY(-2px)",
    },
  },

  divider: {
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  loadingBox: {
    textAlign: "center",
    py: 8,
  },

  paginationBox: {
    display: "flex",
    justifyContent: "center",
    mt: 3,
  },

  pagination: {
    "& .MuiPaginationItem-root": {
      borderRadius: 2,
      fontWeight: 600,
      transition: "all 0.2s ease",
      "&.Mui-selected": {
        background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
        color: "white",
        boxShadow: "0 2px 8px rgba(55, 129, 227, 0.3)",
      },
      "&:hover": {
        bgcolor: "rgba(55, 129, 227, 0.08)",
      },
    },
  },

  totalText: {
    fontWeight: 500,
    color: "text.secondary",
    textAlign: "center",
    mt: 1,
  },
};
