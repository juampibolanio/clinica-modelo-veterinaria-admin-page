import dayjs from "dayjs";

// 🟩 Estados válidos según el backend
export const APPOINTMENT_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

// 🟦 Traducción visible al usuario
export const STATUS_LABELS = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  COMPLETED: "Atendido",
};

// 🟨 Colores MUI para cada estado
export const STATUS_COLOR = {
  PENDING: "warning", // Amarillo
  CONFIRMED: "success", // Verde
  CANCELLED: "error", // Rojo
  COMPLETED: "primary", // Azul (antes default)
};

// 🟪 Formatear estado al texto en español
export const formatStatus = (status) => {
  if (!status) return "-";
  const upper = status.toUpperCase();
  return STATUS_LABELS[upper] || status;
};

// 🧩 Construir payload para backend
export const buildRequestFromForm = (f) => {
  const date = dayjs(f.date).format("YYYY-MM-DD");
  const time = dayjs(`${f.date}T${f.time}`).format("HH:mm");

  return {
    date,
    time,
    reason: f.reason || "",
    notes: f.notes || "",
    status: f.status || "PENDING",
    veterinarianId: Number(f.veterinarianId),
    ownerId: Number(f.ownerId),
    petId: Number(f.petId),
  };
};

// 🔹 Combinar LocalDate + LocalTime para mostrar en calendario
export const toISOFromBackend = (date, time) => {
  const hhmm = (time || "").slice(0, 5);
  return `${date}T${hhmm}:00`;
};
