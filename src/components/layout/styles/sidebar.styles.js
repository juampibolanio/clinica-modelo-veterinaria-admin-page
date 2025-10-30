/**
 * Styles for the Sidebar component using MUI's sx prop format.
 */
export const sidebarStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    bgcolor: "background.paper",
  },

  header: {
    p: { xs: 2, sm: 2.5 },
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    background:
      "linear-gradient(135deg, rgba(55, 129, 227, 0.05) 0%, rgba(90, 158, 240, 0.05) 100%)",
    borderBottom: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
  },

  logo: {
    width: { xs: 32, sm: 36 },
    height: { xs: 32, sm: 36 },
    filter: "drop-shadow(0 2px 4px rgba(55, 129, 227, 0.3))",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },

  headerTitle: {
    fontWeight: 800,
    fontSize: { xs: "1.1rem", sm: "1.2rem" },
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },

  divider: {
    borderColor: "rgba(55, 129, 227, 0.1)",
  },

  navList: {
    flexGrow: 1,
    py: 1,
    px: { xs: 1, sm: 1.5 },
    overflowY: "auto",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      bgcolor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      bgcolor: "rgba(55, 129, 227, 0.2)",
      borderRadius: "3px",
      "&:hover": {
        bgcolor: "rgba(55, 129, 227, 0.3)",
      },
    },
  },

  logoutSection: {
    p: { xs: 1, sm: 1.5 },
    borderTop: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.1)",
    background:
      "linear-gradient(180deg, transparent 0%, rgba(239, 68, 68, 0.02) 100%)",
  },
};
