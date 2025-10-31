export const clinicalHistoryFormStyles = {
  // ===== Contenedor principal del formulario =====
  form: {
    width: "100%",
  },

  // ===== Campos de texto y selects =====
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      transition: "all 0.3s ease",
      bgcolor: "background.paper",
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
    "& .MuiOutlinedInput-input": {
      py: 1.5,
      fontSize: "1rem",
    },
    "& .MuiSelect-select": {
      py: 1.2,
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      minHeight: "48px",
    },
    "& .MuiFormHelperText-root": {
      fontSize: "0.8rem",
      mt: 0.5,
    },
  },

  // ===== Chips de productos seleccionados =====
  chip: {
    bgcolor: "rgba(55,129,227,0.1)",
    color: "primary.main",
    fontWeight: 600,
    borderRadius: "8px",
    px: 0.6,
  },

  // ===== Contenedor de botones (Guardar / Cancelar) =====
  actionsContainer: {
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    mt: 4,
    pt: 3,
    borderTop: "1px solid rgba(55, 129, 227, 0.1)",
  },

  // ===== Botón "Cancelar" =====
  cancelButton: {
    py: 1,
    px: 3,
    borderRadius: 2,
    fontWeight: 600,
    fontSize: "0.95rem",
    textTransform: "none",
    borderWidth: "2px",
    borderColor: "secondary.main",
    color: "secondary.main",
    transition: "all 0.2s ease",
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      bgcolor: "rgba(112, 39, 160, 0.08)",
      borderColor: "secondary.dark",
      transform: "translateY(-1px)",
    },
  },

  // ===== Botón "Guardar" =====
  submitButton: {
    py: 1,
    px: 3,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: "0.95rem",
    textTransform: "none",
    background: "linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)",
    boxShadow: "0 2px 6px rgba(55, 129, 227, 0.3)",
    transition: "all 0.2s ease",
    width: { xs: "100%", sm: "auto" },
    "&:hover": {
      background: "linear-gradient(135deg, #2970d2 0%, #4989da 100%)",
      boxShadow: "0 4px 10px rgba(55, 129, 227, 0.4)",
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      background: "#ccc",
      color: "#666",
      boxShadow: "none",
    },
  },
};
