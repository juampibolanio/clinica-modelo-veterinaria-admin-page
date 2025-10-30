/**
 * Styles for the BlogForm component using MUI's sx prop format.
 */
export const blogFormStyles = {
  form: {
    width: "100%",
  },

  // --- TEXT FIELDS ---
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
  },

  contentField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      fontFamily: '"Nunito", Arial, sans-serif',
      fontSize: "1rem",
      lineHeight: 1.8,
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55, 129, 227, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
  },

  // --- IMAGES SECTION ---
  imagesHeader: {
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

  imagesTitle: {
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "text.primary",
  },

  imageCounter: {
    fontWeight: 600,
    color: "primary.main",
    bgcolor: "rgba(55, 129, 227, 0.15)",
    px: 2,
    py: 0.5,
    borderRadius: 2,
    fontSize: "0.875rem",
  },

  addImageButton: {
    borderRadius: 2,
    px: 3,
    py: 1.2,
    fontWeight: 600,
    textTransform: "none",
    borderColor: "primary.main",
    color: "primary.main",
    transition: "all 0.2s ease",
    alignSelf: "flex-start",
    "&:hover": {
      bgcolor: "rgba(55, 129, 227, 0.08)",
      borderColor: "primary.dark",
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      borderColor: "rgba(0,0,0,0.12)",
      color: "rgba(0,0,0,0.26)",
    },
  },

  // --- IMAGE PREVIEW ---
  imageBox: {
    position: "relative",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(55, 129, 227, 0.12)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(55, 129, 227, 0.2)",
      transform: "translateY(-4px)",
    },
  },

  imagePreview: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 2,
  },

  deleteImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "error.main",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "error.dark",
      transform: "scale(1.1)",
    },
  },

  progressBar: {
    mt: 2,
    height: 8,
    borderRadius: 4,
    bgcolor: "rgba(55, 129, 227, 0.1)",
    "& .MuiLinearProgress-bar": {
      borderRadius: 4,
      background: "linear-gradient(90deg, #3781E3 0%, #5a9aeb 100%)",
    },
  },

  // --- ACTION BUTTONS ---
  actionsContainer: {
    direction: { xs: "column", sm: "row" },
    spacing: 2,
    mt: 4,
  },

  submitButton: {
    py: 1.5,
    px: 4,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 4px 12px rgba(55, 129, 227, 0.3)",
    transition: "all 0.2s ease",
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

  cancelButton: {
    py: 1.5,
    px: 4,
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    borderColor: "secondary.main",
    color: "secondary.main",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(112, 39, 160, 0.08)",
      borderColor: "secondary.dark",
      transform: "translateY(-1px)",
    },
  },
};
