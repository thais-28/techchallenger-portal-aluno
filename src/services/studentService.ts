import { IStudent, IStudentInput } from "../types/student";
import * as StudentRepository from "../repositories/studentRepository";
import * as HttpResponse from "../utils/http-helper";
import bcrypt from "bcrypt";

export const getStudentService = async (
  filters: any,
  pagination: { page: number; limit: number }
) => {
  const students = await StudentRepository.findAllStudents(filters, pagination);

  if (students.length > 0) {
    return HttpResponse.ok(students);
  }

  return HttpResponse.noContent();
};

export const createStudentService = async (studentData: IStudentInput) => {
  if (!studentData || Object.keys(studentData).length === 0) {
    return HttpResponse.badRequest({ message: "Dados obrigatórios ausentes" });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(studentData.senha, 10);
  const studentWithHashedPassword = {
    ...studentData,
    senha: hashedPassword,
  };

  const createdStudent = await StudentRepository.createStudent(
    studentWithHashedPassword
  );
  return HttpResponse.created(createdStudent);
};

export const updateStudentService = async (
  id: string,
  content: Partial<IStudent>
) => {
  if (!content || Object.keys(content).length === 0) {
    return HttpResponse.badRequest({
      message: "Nenhum dado enviado para atualização",
    });
  }

  // Se estiver atualizando a senha, fazer hash
  if (content.senha) {
    content.senha = await bcrypt.hash(content.senha, 10);
  }

  const updatedStudent = await StudentRepository.updateStudent(id, content);

  if (!updatedStudent) {
    return HttpResponse.badRequest({
      message: "Student não encontrado ou ID inválido",
    });
  }

  return HttpResponse.ok(updatedStudent);
};

export const deleteStudentService = async (id: string) => {
  const deleted = await StudentRepository.deleteOneStudent(id);

  if (deleted) {
    return HttpResponse.ok({ message: "Deletado com sucesso" });
  }

  return HttpResponse.badRequest({
    message: "Student não encontrado ou ID inválido",
  });
};
