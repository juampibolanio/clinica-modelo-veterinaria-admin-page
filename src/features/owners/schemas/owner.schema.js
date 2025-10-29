import { z } from "zod";

export const ownerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  surname: z.string().min(1, "El apellido es obligatorio"),
  email: z
    .string()
    .email("Debe ingresar un email válido")
    .optional()
    .or(z.literal("")), 
  phoneNumber: z
    .string()
    .min(6, "Debe ingresar un teléfono válido")
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  documentNumber: z
    .string()
    .min(6, "Debe ingresar un documento válido")
    .optional()
    .or(z.literal("")),
});
