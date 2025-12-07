import { z } from "zod";

export const studentInputSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF deve ter no mínimo 11 caracteres"),
  nascimento: z.string().or(z.date()),
  telefone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
  turma: z.string().min(1, "Turma é obrigatória"),
  email: z.string().email("Email inválido"),
  matricula: z.string().min(5, "Matrícula deve ter no mínimo 5 caracteres"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const studentUpdateSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  cpf: z.string().min(11, "CPF deve ter no mínimo 11 caracteres").optional(),
  nascimento: z.string().or(z.date()).optional(),
  telefone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 caracteres")
    .optional(),
  turma: z.string().min(1, "Turma é obrigatória").optional(),
  email: z.string().email("Email inválido").optional(),
  matricula: z
    .string()
    .min(5, "Matrícula deve ter no mínimo 5 caracteres")
    .optional(),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
});
