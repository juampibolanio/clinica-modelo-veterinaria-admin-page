import { z } from "zod";
import dayjs from "dayjs";

export const appointmentSchema = z.object({
  date: z
    .string()
    .min(1, "La fecha es obligatoria")
    .refine(
      (val) => dayjs(val).isAfter(dayjs().subtract(1, "day")),
      "La fecha no puede ser anterior a hoy"
    ),
  time: z.string().min(1, "La hora es obligatoria"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  veterinarianId: z.string().min(1, "Debe seleccionar un veterinario"),
  ownerId: z.string().min(1, "Debe seleccionar un dueño"),
  petId: z.string().min(1, "Debe seleccionar una mascota"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});
