export const ownerListStyles = {
  header: {
    mb: 1,
    gap: 2,
  },

  title: {
    fontWeight: 800,
    color: "#212121",
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.6rem", sm: "2rem" },
  },

  addButton: {
    px: 3,
    py: 1.2,
    fontWeight: 700,
    borderRadius: 2,
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      transform: "translateY(-2px)",
    },
    width: { xs: "100%", sm: "auto" },
  },

  filtersContainer: {
    bgcolor: "background.paper",
    borderRadius: 2,
    p: 2,
    boxShadow: "0 2px 8px rgba(55,129,227,0.08)",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 2,
  },

  filterField: {
    width: { xs: "100%", sm: 200, md: 220 },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#F7FBFF",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 2px rgba(55,129,227,0.15)",
      },
    },
  },

  searchButton: {
    width: 50,
    height: 40,
    borderRadius: 2,
    transition: "0.2s ease",
    "&:hover": {
      transform: "scale(1.08)",
      boxShadow: "0 2px 6px rgba(55,129,227,0.25)",
    },
  },

  divider: { borderColor: "rgba(55,129,227,0.12)", my: 1 },

  // DataGrid (desktop)
  dataGridContainer: {
    width: "100%",
  },

  dataGrid: {
    border: "1px solid rgba(55,129,227,0.12)",
    borderRadius: 2,
    bgcolor: "background.paper",
    boxShadow: "0 2px 8px rgba(55,129,227,0.08)",
    "& .MuiDataGrid-columnHeaders": {
      bgcolor: "rgba(55,129,227,0.06)",
      fontWeight: 700,
      fontSize: "0.95rem",
      borderBottom: "2px solid rgba(55,129,227,0.12)",
    },
    "& .MuiDataGrid-cell": {
      display: "flex",
      alignItems: "center",
      fontSize: "0.9rem",
      borderBottom: "1px solid rgba(55,129,227,0.08)",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "2px solid rgba(55,129,227,0.12)",
      bgcolor: "rgba(55,129,227,0.03)",
    },
  },

  // Action buttons
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": { transform: "scale(1.15)" },
  },

  // ✅ Mobile card layout
  mobileCard: {
    p: 2.5,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(55,129,227,0.12)",
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "rgba(55,129,227,0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(55,129,227,0.2)",
    },
  },

  mobileTitle: {
    fontWeight: 700,
    color: "text.primary",
    fontSize: "1.1rem",
    lineHeight: 1.4,
  },

  mobileSubtitle: {
    color: "text.secondary",
    fontSize: "0.95rem",
    mt: 0.3,
  },

  mobileMetadata: {
    fontSize: "0.9rem",
    color: "text.secondary",
    mt: 0.5,
  },

  emptyMessage: {
    textAlign: "center",
    color: "text.secondary",
    fontStyle: "italic",
    mt: 2,
  },
};
