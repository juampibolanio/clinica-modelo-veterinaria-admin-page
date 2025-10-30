/**
 * Styles for the BlogCreate page component using MUI's sx prop format.
 */
export const blogCreateStyles = {
  container: {
    spacing: 3,
    maxWidth: "1200px",
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

  subtitle: {
    color: "text.secondary",
    fontSize: "1rem",
    fontWeight: 500,
    mb: 3,
  },
};
