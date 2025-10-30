export const petFormStyles = {
  form: {
    width: "100%",
  },

  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "background.paper",
      transition: "all 0.2s ease",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(55,129,227,0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
    "& .MuiOutlinedInput-input": {
      py: 1.5,
      fontSize: "1rem",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "0.8rem",
      mt: 0.5,
    },
  },

  select: {
    borderRadius: 2,
    "& .MuiSelect-select": {
      py: 1.5,
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
  },

  actionsContainer: {
    mt: 4,
    pt: 3,
    borderTop: "2px solid rgba(55,129,227,0.1)",
  },

  cancelButton: {
    py: 1.3,
    px: 4,
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    borderWidth: "2px",
    borderColor: "secondary.main",
    color: "secondary.main",
    transition: "all 0.2s ease",
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      bgcolor: "rgba(112,39,160,0.08)",
      transform: "translateY(-1px)",
    },
  },

  submitButton: {
    py: 1.3,
    px: 4,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 4px 12px rgba(55,129,227,0.3)",
    transition: "all 0.2s ease",
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      transform: "translateY(-2px)",
    },
    "&:disabled": {
      background: "#ccc",
      color: "#666",
    },
  },
};
