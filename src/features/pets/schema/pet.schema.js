import { z } from "zod";

// Pet schema for form validation
export const petSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  species: z.string().min(1, "Selecciona una especie"),
  breed: z.string().optional(),
  gender: z.string().min(1, "Selecciona un género"),
  color: z.string().optional(),
  weight: z.coerce
    .number({ invalid_type_error: "El peso debe ser un número" })
    .nonnegative("El peso no puede ser negativo"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  allergies: z.string().optional(),
  ownerId: z.coerce.number({
    invalid_type_error: "El ID del dueño es requerido",
  }),
});
