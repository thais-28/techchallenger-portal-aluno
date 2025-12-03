import { z } from "zod";

export const studentInputSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  matricula: z.string().min(5, "Matrícula deve ter no mínimo 5 caracteres"),
  turma: z.string().min(3, "Curso deve ter no mínimo 3 caracteres"),
  dataNascimento: z.string().or(z.date()).optional(),
  telefone: z.string().optional(),
});

export const studentUpdateSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  matricula: z
    .string()
    .min(5, "Matrícula deve ter no mínimo 5 caracteres")
    .optional(),
  turma: z.string().min(3, "Curso deve ter no mínimo 3 caracteres").optional(),
  dataNascimento: z.string().or(z.date()).optional(),
  telefone: z.string().optional(),
});
