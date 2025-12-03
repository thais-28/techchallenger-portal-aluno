import { z } from "zod";

export const teacherInputSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  nascimento: z.string().min(1, "Nascimento é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  disciplina: z.string().min(1, "Disciplina é obrigatório"),
  email: z.string().min(1, "Email é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatório"),
});

export const teacherUpdateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  cpf: z.string().min(1, "CPF é obrigatório").optional(),
  nascimento: z.string().min(1, "Nascimento é obrigatório").optional(),
  telefone: z.string().min(1, "Telefone é obrigatório").optional(),
  disciplina: z.string().min(1, "Disciplina é obrigatório").optional(),
  email: z.string().min(1, "Email é obrigatório").optional(),
  matricula: z.string().min(1, "Matrícula é obrigatório").optional(),
  senha: z.string().min(1, "Senha é obrigatório").optional(),
});
