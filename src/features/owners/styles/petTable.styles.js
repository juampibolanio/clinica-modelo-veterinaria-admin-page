export const petTableStyles = {
  paper: {
    p: { xs: 2.5, sm: 3.5 },
    borderRadius: 2.5,
    border: "1px solid rgba(55,129,227,0.12)",
    boxShadow: "0 2px 10px rgba(55,129,227,0.12)",
    transition: "all 0.3s ease",
  },

  header: {
    direction: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    mb: 2,
  },

  title: { fontWeight: 700, fontSize: "1.2rem", color: "text.primary" },

  divider: { mb: 3, borderColor: "rgba(55,129,227,0.12)" },

  /* 💻 Table styles */
  tableWrapper: {
    border: "1px solid rgba(55,129,227,0.12)",
    borderRadius: 2,
    overflowX: "auto",
  },
  tableHead: {
    "& .MuiTableCell-head": {
      fontWeight: 700,
      fontSize: "0.9rem",
      bgcolor: "rgba(55,129,227,0.06)",
      borderBottom: "2px solid rgba(55,129,227,0.15)",
      py: 1.6,
      color: "text.primary",
    },
  },
  tableRow: {
    transition: "all 0.2s ease",
    "&:hover": { bgcolor: "rgba(55,129,227,0.04)" },
  },
  tableCell: {
    py: 1.4,
    fontSize: "0.95rem",
    borderBottom: "1px solid rgba(55,129,227,0.08)",
  },

  /* 📱 Mobile cards */
  mobileCard: {
    p: 2.5,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(55,129,227,0.12)",
    border: "1px solid rgba(55,129,227,0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 4px 16px rgba(55,129,227,0.2)",
    },
  },
  mobileTitle: {
    fontWeight: 700,
    color: "text.primary",
    fontSize: "1.1rem",
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

  /* Common elements */
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": { transform: "scale(1.15)" },
  },
  emptyState: {
    py: 4,
    px: 2,
    textAlign: "center",
    bgcolor: "rgba(55,129,227,0.03)",
    borderRadius: 2,
    border: "1px dashed rgba(55,129,227,0.2)",
  },
  emptyText: {
    fontWeight: 500,
    color: "text.secondary",
    fontSize: "0.95rem",
  },
};
