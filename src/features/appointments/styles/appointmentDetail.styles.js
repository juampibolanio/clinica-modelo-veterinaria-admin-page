export const appointmentDetailStyles = {
  container: {
    p: { xs: 1, sm: 2 },
    gap: 2,
  },
  header: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
  },
  headerTitle: {
    fontWeight: 800,
    fontSize: { xs: "1.6rem", md: "1.9rem" },
    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  paper: {
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    border: "1px solid rgba(55,129,227,0.1)",
    boxShadow: "0 4px 16px rgba(55,129,227,0.08)",
    bgcolor: "background.paper",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "1.2rem",
    mb: 1,
  },
  gridItem: {
    "& strong": { color: "text.primary" },
    "& p": { color: "text.secondary", mb: 0.5 },
  },
  editButton: {
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    borderWidth: "2px",
    borderColor: "primary.main",
    color: "primary.main",
    "&:hover": {
      bgcolor: "rgba(55,129,227,0.08)",
      borderColor: "primary.dark",
      transform: "translateY(-1px)",
    },
  },
  deleteButton: {
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    color: "#fff",
    background: "linear-gradient(135deg, #E53935 0%, #D32F2F 100%)",
    "&:hover": {
      background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
      transform: "translateY(-1px)",
    },
  },

  backButton: {
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    color: "text.primary",
    borderColor: "rgba(0,0,0,0.15)",
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.04)",
      borderColor: "rgba(0,0,0,0.25)",
      transform: "translateY(-1px)",
    },
  },
};
