/**
 * Styles for the BlogTable component using MUI's sx prop format.
 */
export const blogTableStyles = {
  // Mobile card view
  mobileCard: {
    p: 2.5,
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
    bgcolor: "background.paper",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(55, 129, 227, 0.15)",
      transform: "translateY(-2px)",
      borderColor: "rgba(55, 129, 227, 0.2)",
    },
  },

  mobileTitle: {
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "text.primary",
    mb: 0.5,
  },

  mobileSubtitle: {
    fontSize: "0.875rem",
    color: "text.secondary",
    mb: 1,
  },

  mobileMetadata: {
    fontSize: "0.875rem",
    color: "text.secondary",
    mt: 1,
    fontWeight: 500,
  },

  mobileActions: {
    direction: "row",
    spacing: 1,
    mt: 2,
  },

  // Desktop table view
  tableWrapper: {
    overflowX: "auto",
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  table: {
    size: "small",
  },

  tableHead: {
    "& .MuiTableCell-head": {
      bgcolor: "rgba(55, 129, 227, 0.06)",
      fontWeight: 700,
      fontSize: "0.875rem",
      color: "text.primary",
      borderBottom: "2px solid",
      borderColor: "rgba(55, 129, 227, 0.15)",
      py: 1.5,
    },
  },

  tableRow: {
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(55, 129, 227, 0.04)",
    },
    "&:last-child td": {
      borderBottom: 0,
    },
  },

  tableCell: {
    py: 1.5,
    borderBottom: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.08)",
  },

  titleCell: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "text.primary",
  },

  contentPreview: {
    fontSize: "0.875rem",
    color: "text.secondary",
    noWrap: true,
  },

  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },

  emptyMessage: {
    color: "text.secondary",
    textAlign: "center",
    py: 4,
    fontWeight: 500,
  },
};
