export const appointmentStyles = {
  headerTitle: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  paperCard: {
    p: { xs: 2, sm: 3 },
    borderRadius: 2,
    border: "1px solid rgba(55,129,227,0.12)",
    boxShadow: "0 2px 10px rgba(55,129,227,0.08)",
    bgcolor: "background.paper",
  },

  applyButton: {
    textTransform: "none",
    fontWeight: 700,
    borderRadius: 2,
    px: 3,
    py: 1,
    borderColor: "rgba(55,129,227,0.3)",
    color: "#3781E3",
    "&:hover": {
      borderColor: "#3781E3",
      background: "rgba(55,129,227,0.08)",
    },
  },

  viewButton: {
    textTransform: "none",
    borderRadius: 2,
    fontWeight: 600,
    "&:hover": {
      transform: "translateY(-1px)",
    },
  },
};
