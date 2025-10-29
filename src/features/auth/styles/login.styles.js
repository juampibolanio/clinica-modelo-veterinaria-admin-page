/**
 * Styles for the Login component using MUI's sx prop format.
 */
export const loginStyles = {
  // Page container background and layout
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #E6F7FF 0%, #d0ebff 100%)",
    px: { xs: 2, sm: 3 },
    py: 4,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-10%",
      right: "-5%",
      width: { xs: "300px", md: "500px" },
      height: { xs: "300px", md: "500px" },
      borderRadius: "50%",
      background: "rgba(55, 129, 227, 0.08)",
      filter: "blur(60px)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-15%",
      left: "-10%",
      width: { xs: "350px", md: "600px" },
      height: { xs: "350px", md: "600px" },
      borderRadius: "50%",
      background: "rgba(112, 39, 160, 0.06)",
      filter: "blur(80px)",
    },
  },

  // Card container (main box)
  card: {
    width: "100%",
    maxWidth: 460,
    boxShadow:
      "0 20px 60px rgba(55, 129, 227, 0.15), 0 8px 16px rgba(0, 0, 0, 0.05)",
    borderRadius: 3,
    position: "relative",
    zIndex: 1,
    border: "1px solid rgba(55, 129, 227, 0.08)",
  },

  // Header section with gradient
  header: {
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    px: { xs: 3, sm: 4 },
    py: { xs: 4, sm: 5 },
    textAlign: "center",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      opacity: 0.4,
    },
  },

  // Card content section
  cardContent: {
    p: { xs: 3, sm: 4, md: 5 },
  },

  // Title for the form section
  formTitle: {
    mb: 3,
    fontWeight: 700,
    color: "#2B2B2B",
    fontSize: { xs: "1.1rem", sm: "1.25rem" },
  },

  // TextField shared styles
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3781E3",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
  },

  // Submit button style
  submitButton: {
    py: 1.5,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 4px 12px rgba(55, 129, 227, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      boxShadow: "0 6px 20px rgba(55, 129, 227, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&.Mui-disabled": {
      background: "#ccc",
      color: "#666",
    },
  },
};
