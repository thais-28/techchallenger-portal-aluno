import * as TeacherRepository from "../repositories/teacherRepository";
import * as HttpResponse from "../utils/http-helper";
import { ITeacher } from "../types/teacher";
import bcrypt from 'bcrypt';

export const getTeacherService = async (
  filters: any,
  pagination: { page: number; limit: number }
) => {
  const teachers = await TeacherRepository.findAllTeachers(filters, pagination);

  if (teachers.length > 0) {
    return HttpResponse.ok(teachers);
  }

  return HttpResponse.noContent();
};

export const createTeacherService = async (teacherData: ITeacher) => {
  if (!teacherData || Object.keys(teacherData).length === 0) {
    return HttpResponse.badRequest({ message: "Dados obrigatórios ausentes" });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(teacherData.senha, 10);
  const teacherWithHashedPassword = {
    ...teacherData,
    senha: hashedPassword,
  };

  const createdTeacher = await TeacherRepository.createTeacher(teacherWithHashedPassword);
  return HttpResponse.created(createdTeacher);
};

export const deleteTeacherService = async (id: string) => {
  const deleted = await TeacherRepository.deleteOneTeacher(id);

  if (deleted) {
    return HttpResponse.ok({ message: "Deletado com sucesso" });
  }

  return HttpResponse.badRequest({
    message: "Teacher não encontrado ou ID inválido",
  });
};

export const updateTeacherService = async (
  id: string,
  content: Partial<ITeacher>
) => {
  if (!content || Object.keys(content).length === 0) {
    return HttpResponse.badRequest({
      message: "Nenhum dado enviado para atualização",
    });
  }

  const updatedTeacher = await TeacherRepository.updateTeacher(id, content);

  if (!updatedTeacher) {
    return HttpResponse.badRequest({
      message: "Teacher não encontrado ou ID inválido",
    });
  }

  return HttpResponse.ok(updatedTeacher);
};