export const ownerDetailStyles = {
  loadingBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },

  container: {
    spacing: 4,
    mb: 4,
  },

  // Header principal
  header: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "stretch", sm: "center" },
    justifyContent: "space-between",
    gap: 2,
    mb: 3,
  },

  backButton: {
    px: 3,
    py: 1,
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    color: "secondary.main",
    borderColor: "secondary.main",
    borderWidth: 1.5,
    width: { xs: "100%", sm: "auto" },
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(112,39,160,0.08)",
      transform: "translateY(-1px)",
    },
  },

  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg,#3781E3 0%,#7027A0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: { xs: "1.6rem", sm: "2rem" },
    textAlign: { xs: "center", sm: "left" },
  },

  editButton: {
    px: 3,
    py: 1,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    width: { xs: "100%", sm: "auto" },
    background: "linear-gradient(135deg,#3781E3 0%,#5a9aeb 100%)",
    boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg,#2970d2 0%,#4989da 100%)",
      transform: "translateY(-2px)",
    },
  },

  // Información Personal
  infoPaper: {
    p: { xs: 2.5, sm: 3.5 },
    borderRadius: 2.5,
    border: "1px solid rgba(55,129,227,0.12)",
    boxShadow: "0 2px 10px rgba(55,129,227,0.12)",
    mb: 3,
  },

  sectionTitle: {
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "text.primary",
  },

  divider: {
    my: 2,
    borderColor: "rgba(55,129,227,0.12)",
  },

  infoLabel: {
    fontWeight: 600,
    fontSize: "0.85rem",
    color: "text.secondary",
    mb: 0.5,
    textTransform: "uppercase",
  },

  infoValue: {
    fontWeight: 500,
    fontSize: "1rem",
    color: "text.primary",
  },

  // Deuda
  debtField: {
    width: { xs: "100%", sm: 140 },
    "& .MuiOutlinedInput-root": { borderRadius: 2 },
  },

  debtValue: (hasDebt) => ({
    fontWeight: 700,
    fontSize: "1.05rem",
    color: hasDebt ? "error.main" : "success.main",
  }),

  iconButton: {
    transition: "all 0.2s ease",
    "&:hover": { transform: "scale(1.1)" },
  },

  // Mascotas
  petsHeader: {
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    mb: 2,
    mt: 2,
  },

  petsTitle: {
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "text.primary",
  },

  addPetButton: {
    px: 3,
    py: 1,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    width: { xs: "100%", sm: "auto" },
    background: "linear-gradient(135deg,#3781E3 0%,#5a9aeb 100%)",
    boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg,#2970d2 0%,#4989da 100%)",
    },
  },

  // Turnos
  appointmentsPaper: {
    p: { xs: 2.5, sm: 3.5 },
    borderRadius: 2.5,
    border: "1px solid rgba(55,129,227,0.12)",
    boxShadow: "0 2px 10px rgba(55,129,227,0.12)",
    mt: 3,
  },

  appointmentsHeader: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    gap: 1.5,
    mb: 2,
  },

  appointmentsTitle: {
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "text.primary",
  },

  addAppointmentButton: {
    px: 3,
    py: 1,
    borderRadius: 2,
    fontWeight: 700,
    textTransform: "none",
    width: { xs: "100%", sm: "auto" },
    background: "linear-gradient(135deg,#3781E3 0%,#5a9aeb 100%)",
    boxShadow: "0 3px 10px rgba(55,129,227,0.25)",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg,#2970d2 0%,#4989da 100%)",
      transform: "translateY(-2px)",
    },
  },

  appointmentItem: { py: 2 },

  appointmentRow: {
    flexDirection: { xs: "column", sm: "row" },
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 1.5,
  },

  appointmentDate: {
    fontWeight: 600,
    fontSize: "0.95rem",
    minWidth: { sm: 150 },
  },

  appointmentInfo: {
    flex: 1,
    fontSize: "0.95rem",
    color: "text.primary",
  },

  viewButton: {
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { bgcolor: "rgba(55,129,227,0.08)" },
  },

  emptyState: {
    py: 4,
    px: 2,
    textAlign: "center",
    bgcolor: "rgba(55,129,227,0.03)",
    borderRadius: 2,
    border: "1px dashed rgba(55,129,227,0.2)",
  },

  emptyText: {
    fontWeight: 500,
    color: "text.secondary",
    fontSize: "0.95rem",
  },
};
