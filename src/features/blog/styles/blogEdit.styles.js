/**
 * Styles for the BlogEdit page component using MUI's sx prop format.
 */
export const blogEditStyles = {
  loadingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },

  container: {
    maxWidth: "1200px",
    mx: "auto",
    width: "100%",
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.75rem", sm: "2rem" },
  },

  alert: {
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.15)",
  },

  divider: {
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  sectionHeader: {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
    px: 2.5,
    bgcolor: "rgba(55, 129, 227, 0.04)",
    borderRadius: 2,
    border: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  sectionTitle: {
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "text.primary",
  },

  imageCounter: {
    fontWeight: 600,
    color: "primary.main",
    bgcolor: "rgba(55, 129, 227, 0.1)",
    px: 2,
    py: 0.5,
    borderRadius: 2,
  },
};
