export const petDetailStyles = {
  container: {
    p: { xs: 1, sm: 3 },
    spacing: 4,
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  backButton: {
    borderRadius: 2,
    textTransform: "none",
    px: 3,
    py: 1,
    fontWeight: 600,
    borderWidth: 2,
    "&:hover": {
      transform: "translateY(-1px)",
      bgcolor: "rgba(112,39,160,0.08)",
    },
  },

  editButton: {
    textTransform: "none",
    fontWeight: 700,
    px: 3,
    py: 1.2,
    borderRadius: 2,
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      transform: "translateY(-2px)",
    },
  },

  infoCard: {
    p: { xs: 2, sm: 3 },
    borderRadius: 2,
    border: "1px solid rgba(55,129,227,0.12)",
    boxShadow: "0 2px 10px rgba(55,129,227,0.08)",
    bgcolor: "background.paper",
  },

  divider: {
    mb: 2,
    borderColor: "rgba(55,129,227,0.15)",
  },

  smallButton: {
    textTransform: "none",
    borderRadius: 2,
    fontWeight: 600,
    px: 2,
    py: 0.6,
    "&:hover": {
      transform: "translateY(-1px)",
    },
  },
};
