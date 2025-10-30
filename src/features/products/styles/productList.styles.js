/**
 * Styles for the ProductList page component using MUI's sx prop format.
 * Supports both DataGrid (desktop) and Card (mobile) layouts.
 */
export const productListStyles = {
  container: {
    spacing: 3,
  },

  // Header section
  header: {
    direction: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    spacing: 2,
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
    py: 1.2,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 4px 12px rgba(55, 129, 227, 0.3)",
    transition: "all 0.2s ease",
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      boxShadow: "0 6px 20px rgba(55, 129, 227, 0.4)",
      transform: "translateY(-2px)",
    },
  },

  divider: {
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  // Alert for low stock
  lowStockAlert: {
    borderRadius: 2,
    border: "1px solid",
    borderColor: "warning.main",
    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.15)",
    "& .MuiAlert-icon": {
      fontSize: "1.5rem",
    },
  },

  // ✅ DataGrid (Desktop)
  dataGridContainer: {
    width: "100%",
    height: { xs: 450, sm: 600, md: 650 },
    "& .MuiDataGrid-root": {
      border: "1px solid",
      borderColor: "rgba(55, 129, 227, 0.12)",
      borderRadius: 2,
      bgcolor: "background.paper",
      boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
    },
    "& .MuiDataGrid-columnHeaders": {
      bgcolor: "rgba(55, 129, 227, 0.06)",
      borderBottom: "2px solid",
      borderColor: "rgba(55, 129, 227, 0.15)",
      fontWeight: 700,
      fontSize: "0.95rem",
      color: "text.primary",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
    },
    "& .MuiDataGrid-row": {
      transition: "all 0.2s ease",
      "&:hover": {
        bgcolor: "rgba(55, 129, 227, 0.04)",
        cursor: "pointer",
      },
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid",
      borderColor: "rgba(55, 129, 227, 0.08)",
      fontSize: "0.95rem",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "2px solid",
      borderColor: "rgba(55, 129, 227, 0.12)",
      bgcolor: "rgba(55, 129, 227, 0.02)",
    },
  },

  // Stock cell styles
  stockCell: (stock) => ({
    fontWeight: stock < 5 ? 700 : 500,
    color:
      stock === 0 ? "error.main" : stock < 5 ? "warning.main" : "text.primary",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  }),

  // Action buttons in cells
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.15)",
    },
  },

  // ✅ Mobile layout styles (Card view)
  mobileCard: {
    p: 2.5,
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.12)",
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 16px rgba(55, 129, 227, 0.2)",
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
