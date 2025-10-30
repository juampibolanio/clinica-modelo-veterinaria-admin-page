/**
 * Styles for the OwnerEdit page component using MUI's sx prop format.
 */
export const ownerEditStyles = {
  loadingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },

  container: {
    spacing: 3,
    maxWidth: "1000px",
    mx: "auto",
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.75rem", sm: "2rem" },
    mb: 1,
  },
};
