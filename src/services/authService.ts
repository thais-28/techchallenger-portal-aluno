import bcrypt from "bcrypt";
import { TeacherModel } from "../models/teacherModel";
import { StudentModel } from "../models/studentModel";
import { generateToken } from "../utils/jwt";
import * as HttpResponse from "../utils/http-helper";

export const loginService = async (email: string, senha: string) => {
  // Busca professor
  let user = await TeacherModel.findOne({ email }).lean();
  let role: "teacher" | "student" = "teacher";

  // Se não encontrou professor, busca aluno
  if (!user) {
    user = await StudentModel.findOne({ email }).lean();
    role = "student";
  }

  if (!user) {
    return HttpResponse.badRequest({ message: "Credenciais inválidas" });
  }

  // Verifica senha
  const isPasswordValid = await bcrypt.compare(senha, user.senha);
  if (!isPasswordValid) {
    return HttpResponse.badRequest({ message: "Credenciais inválidas" });
  }

  // Gera token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role,
  });

  return HttpResponse.ok({
    token,
    user: {
      id: user._id,
      nome: user.nome,
      email: user.email,
      role,
    },
  });
};
