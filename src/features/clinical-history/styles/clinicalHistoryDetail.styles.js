export const clinicalHistoryDetail = {
  // ======= Header =======
  header: {
    direction: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    spacing: 2,
    justifyContent: "space-between",
    mb: 2,
  },

  backButton: {
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    px: 2.5,
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(112,39,160,0.08)",
      transform: "translateY(-1px)",
    },
  },

  title: {
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: { xs: "left", sm: "center" },
    flexGrow: 1,
    fontWeight: 800,
  },

  editButton: {
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 3px 8px rgba(55,129,227,0.25)",
    transition: "all 0.25s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      transform: "translateY(-2px)",
    },
  },

  // ======= Paper cards =======
  sectionCard: {
    p: 3,
    borderRadius: 2,
    bgcolor: "background.paper",
    boxShadow: "0 2px 10px rgba(55,129,227,0.08)",
    border: "1px solid rgba(55,129,227,0.1)",
  },

  sectionTitle: {
    fontWeight: 700,
    mb: 1,
    color: "text.primary",
  },

  divider: {
    mb: 2,
    borderColor: "rgba(55,129,227,0.12)",
  },

  // ======= Label-value rows =======
  gridRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 0.8,
    flexWrap: "wrap",
  },

  gridLabel: {
    minWidth: 180,
    fontWeight: 600,
    color: "text.secondary",
  },

  gridValue: {
    fontWeight: 500,
    color: "text.primary",
  },

  gridAction: {
    ml: 2,
  },

  // ======= Chips for used products =======
  productChip: {
    bgcolor: "rgba(55,129,227,0.1)",
    color: "primary.main",
    fontWeight: 600,
    borderRadius: "8px",
  },
};
