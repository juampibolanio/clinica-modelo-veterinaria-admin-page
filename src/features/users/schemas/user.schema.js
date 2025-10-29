import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  name: z.string().min(2, "El nombre es obligatorio"),
  surname: z.string().min(2, "El apellido es obligatorio"),
  email: z.string().email("Debe ser un email válido"),
  phoneNumber: z.string().optional(),
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Seleccione un rol válido" }),
  }),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(),
});
