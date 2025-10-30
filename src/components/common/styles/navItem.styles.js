/**
 * Styles for the NavItem component using MUI's sx prop format.
 */
export const navItemStyles = {
  listItemButton: (active, color) => ({
    color:
      color === "error"
        ? "error.main"
        : active
        ? "primary.main"
        : "text.primary",
    bgcolor: active ? "rgba(55, 129, 227, 0.12)" : "transparent",
    borderRadius: 2,
    mx: 1,
    mb: 0.5,
    py: 1.2,
    px: 2,
    position: "relative",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",

    // Active indicator bar
    ...(active && {
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "60%",
        bgcolor: "primary.main",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(55, 129, 227, 0.4)",
      },
    }),

    "&:hover": {
      bgcolor:
        color === "error"
          ? "rgba(239, 68, 68, 0.08)"
          : "rgba(55, 129, 227, 0.08)",
      transform: "translateX(1px)",

      "& .MuiListItemIcon-root": {
        color: color === "error" ? "error.main" : "primary.main",
        transform: "scale(1.1)",
      },

      "& .MuiListItemText-primary": {
        fontWeight: 700,
      },
    },

    "&:active": {
      transform: "translateX(2px)",
    },
  }),

  listItemIcon: (active, color) => ({
    color:
      color === "error"
        ? "error.main"
        : active
        ? "primary.main"
        : "text.secondary",
    minWidth: 40,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),

  listItemText: (active) => ({
    "& .MuiListItemText-primary": {
      fontWeight: active ? 700 : 600,
      fontSize: "0.90rem",
      transition: "all 0.25s ease",
    },
  }),

  expandIcon: (open) => ({
    color: "text.secondary",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  }),

  collapse: {
    pl: 1,
  },

  subItemButton: (subActive) => ({
    pl: 7,
    py: 0.8,
    color: subActive ? "primary.main" : "text.secondary",
    bgcolor: subActive ? "rgba(55, 129, 227, 0.08)" : "transparent",
    borderRadius: 1.5,
    mx: 1,
    mb: 0.4,
    transition: "all 0.2s ease",
    position: "relative",

    ...(subActive && {
      "&::before": {
        content: '""',
        position: "absolute",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "6px",
        height: "6px",
        bgcolor: "primary.main",
        borderRadius: "50%",
        boxShadow: "0 0 6px rgba(55, 129, 227, 0.5)",
      },
    }),

    "&:hover": {
      bgcolor: "rgba(55, 129, 227, 0.1)",
      pl: 7.5,
      "& .MuiListItemText-primary": {
        color: "primary.main",
        fontWeight: 600,
      },
    },
  }),

  subItemText: (subActive) => ({
    "& .MuiListItemText-primary": {
      fontSize: "0.875rem",
      fontWeight: subActive ? 600 : 500,
      transition: "all 0.2s ease",
    },
  }),
};
