/**
 * Styles for the DashboardLayout component using MUI's sx prop format.
 */
export const dashboardLayoutStyles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    bgcolor: "background.default",
  },

  nav: {
    width: { md: 240 },
    flexShrink: { md: 0 },
  },

  drawerMobile: {
    "& .MuiDrawer-paper": {
      width: 240,
      bgcolor: "background.paper",
      boxShadow: "8px 0 24px rgba(55, 129, 227, 0.12)",
    },
  },

  drawerDesktop: {
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      bgcolor: "background.paper",
      borderRight: "1px solid",
      borderColor: "rgba(55, 129, 227, 0.12)",
      boxShadow: "4px 0 12px rgba(55, 129, 227, 0.06)",
      transition: "all 0.3s ease",
    },
  },

  main: {
    flexGrow: 1,
    width: { md: "calc(100% - 240px)" },
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
  },

  contentWrapper: {
    flexGrow: 1,
    p: { xs: 2.5, sm: 3, md: 3.5 },
    animation: "fadeIn 0.4s ease-in-out",
    bgcolor: "transparent",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(10px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },
};
