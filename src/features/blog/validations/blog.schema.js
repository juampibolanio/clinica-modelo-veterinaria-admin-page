import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "El título es obligatorio"),
  subtitle: z.string().optional(),
  content: z.string().min(20, "El contenido debe tener al menos 20 caracteres"),
  imageDescriptions: z.array(z.string()).optional(),
});
