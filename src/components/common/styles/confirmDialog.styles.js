/**
 * Styles for the ConfirmDialog component using MUI's sx prop format.
 */
export const confirmDialogStyles = {
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: 3,
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
      overflow: "visible",
    },
  },

  dialogTitle: {
    pb: 2,
    pt: 3,
    px: 3,
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "text.primary",
    borderBottom: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.12)",
    background:
      "linear-gradient(180deg, rgba(55, 129, 227, 0.03) 0%, transparent 100%)",
  },

  dialogContent: {
    pt: 3,
    pb: 2,
    px: 3,
  },

  messageText: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "text.secondary",
  },

  dialogActions: {
    px: 3,
    pb: 3,
    pt: 2,
    gap: 1.5,
    borderTop: "1px solid",
    borderColor: "rgba(55, 129, 227, 0.08)",
  },

  cancelButton: {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 600,
    textTransform: "none",
    color: "text.secondary",
    border: "1px solid",
    borderColor: "rgba(0, 0, 0, 0.12)",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(0, 0, 0, 0.04)",
      borderColor: "rgba(0, 0, 0, 0.2)",
      transform: "translateY(-1px)",
    },
  },

  confirmButton: {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },

  // Variant for success/primary confirm
  confirmButtonPrimary: {
    borderRadius: 2,
    px: 3,
    py: 1,
    fontWeight: 700,
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
  },
};
