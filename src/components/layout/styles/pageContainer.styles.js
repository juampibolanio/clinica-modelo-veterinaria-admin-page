/**
 * Styles for the PageContainer component using MUI's sx prop format.
 */
export const pageContainerStyles = {
  container: {
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 3, sm: 3.5, md: 4 },
    position: "relative",
    bgcolor: "background.default",
    borderRadius: 2,
    minHeight: "calc(100vh - 80px)", 

    // Subtle top gradient background
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "200px",
      background:
        "linear-gradient(180deg, rgba(55, 129, 227, 0.05) 0%, transparent 100%)",
      borderRadius: "0 0 24px 24px",
      pointerEvents: "none",
      zIndex: 0,
    },

    "& > *": {
      position: "relative",
      zIndex: 1,
    },
  },
};
