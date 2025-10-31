export const reportsStyles = {
  container: {
    p: { xs: 1.5, sm: 3 },
  },

  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    bgcolor: "background.paper",
    borderRadius: 2,
    p: { xs: 2, sm: 3 },
    boxShadow: "0 2px 10px rgba(55,129,227,0.1)",
    gap: 2,
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.6rem", sm: "2rem" },
  },

  filtersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  },

  filterSelect: {
    minWidth: 130,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#F7FBFF",
      "&.Mui-focused fieldset": {
        borderColor: "#3781E3",
        boxShadow: "0 0 0 2px rgba(55,129,227,0.15)",
      },
    },
  },

  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 280,
  },

  statCard: {
    p: 2.5,
    borderRadius: 2,
    textAlign: "center",
    bgcolor: "#FFFFFF",
    boxShadow: "0 3px 12px rgba(55,129,227,0.1)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 5px 14px rgba(55,129,227,0.15)",
    },
  },

  chartCard: {
    p: { xs: 2, sm: 3 },
    borderRadius: 2,
    bgcolor: "#FFFFFF",
    boxShadow: "0 2px 10px rgba(55,129,227,0.08)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(55,129,227,0.2)",
    },
  },

  chartTitle: {
    fontWeight: 700,
    mb: 2,
    color: "#212121",
  },
};
