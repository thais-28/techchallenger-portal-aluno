import { Types } from "mongoose";
import { IStudentModel, StudentModel } from "../models/studentModel";
import { IStudent } from "../types/student";

export const findAllStudents = async (
  filters: any = {},
  pagination: { page: number; limit: number }
) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const students = await StudentModel.find(filters).skip(skip).limit(limit).lean();
  return students;
};


export const createStudent = async (data: IStudent) => {

  const student = await StudentModel.create(data);
  return student.toObject();
}

export const deleteOneStudent = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await StudentModel.findByIdAndDelete(id);
  return result != null;
};

export const updateStudent = async (id: string, data: Partial<IStudentModel>) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return await StudentModel.findByIdAndUpdate(id, data, { new: true }).lean();
};