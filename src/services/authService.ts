import bcrypt from "bcrypt";
import { TeacherModel } from "../models/teacherModel";
import { StudentModel } from "../models/studentModel";
import { generateToken } from "../utils/jwt";
import * as HttpResponse from "../utils/http-helper";

interface UserBase {
  _id: unknown;
  nome: string;
  email: string;
  senha: string;
}

export const loginService = async (email: string, senha: string) => {
  let user: UserBase | null = null;
  let role: "teacher" | "student" = "teacher";

  const teacher = await TeacherModel.findOne({ email }).lean();
  if (teacher) {
    user = teacher;
    role = "teacher";
  } else {
    const student = await StudentModel.findOne({ email }).lean();
    if (student) {
      user = student;
      role = "student";
    }
  }

  if (!user) {
    return HttpResponse.badRequest({ message: "Credenciais inválidas" });
  }

  const isPasswordValid = await bcrypt.compare(senha, user.senha);
  if (!isPasswordValid) {
    return HttpResponse.badRequest({ message: "Credenciais inválidas" });
  }

  const token = generateToken({
    id: String(user._id),
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
