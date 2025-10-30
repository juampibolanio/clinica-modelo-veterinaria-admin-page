/**
 * Styles for the Topbar component using MUI's sx prop format.
 */
export const topbarStyles = {
  appBar: {
    position: "fixed",
    bgcolor: "background.paper",
    borderBottom: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.08)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
  },

  toolbar: {
    justifyContent: "space-between",
    minHeight: { xs: 64, sm: 70 },
    px: { xs: 2, sm: 3 },
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: { xs: 1, sm: 1.5 },
  },

  menuButton: {
    display: { md: "none" },
    color: "primary.main",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(55, 129, 227, 0.08)",
      transform: "scale(1.05)",
    },
  },

  logoText: {
    fontWeight: 800,
    color: "primary.main",
    fontSize: { xs: "1.1rem", sm: "1.25rem" },
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: { xs: 1, sm: 2 },
  },

  userInfoContainer: {
    display: { xs: "none", sm: "flex" },
    alignItems: "center",
    gap: 1.5,
    px: 2,
    py: 1,
    borderRadius: 2,
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      bgcolor: "rgba(55, 129, 227, 0.06)",
    },
  },

  avatar: {
    bgcolor: "secondary.main",
    width: { xs: 36, sm: 40 },
    height: { xs: 36, sm: 40 },
    fontWeight: 700,
    fontSize: "0.95rem",
    boxShadow: "0 2px 8px rgba(112, 39, 160, 0.25)",
    border: "2px solid",
    borderColor: "background.paper",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.08)",
      boxShadow: "0 4px 12px rgba(112, 39, 160, 0.35)",
    },
  },

  avatarMobile: {
    bgcolor: "secondary.main",
    width: 36,
    height: 36,
    fontWeight: 700,
    fontSize: "0.9rem",
    boxShadow: "0 2px 8px rgba(112, 39, 160, 0.25)",
    display: { xs: "flex", sm: "none" },
  },

  userInfoText: {
    textAlign: "right",
  },

  userName: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "text.primary",
    lineHeight: 1.3,
  },

  userRole: {
    fontSize: "0.75rem",
    color: "text.secondary",
    fontWeight: 500,
  },
};
