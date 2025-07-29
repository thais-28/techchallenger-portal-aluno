// src/validations/postValidation.ts
import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  subject: z.string().min(1, "Assunto é obrigatório"),
});
