import { Types } from "mongoose";
import { TeacherModel } from "../models/teacherModel";
import { ITeacher } from "../types/teacher";

export const findAllTeachers = async (
  filters: any = {},
  pagination: { page: number; limit: number }
) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const teachers = await TeacherModel.find(filters).skip(skip).limit(limit).lean();
  return teachers;
};


export const createTeacher = async (data: ITeacher) => {

  const teacher = await TeacherModel.create(data);
  return teacher.toObject();
}

export const deleteOneTeacher = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await TeacherModel.findByIdAndDelete(id);
  return result != null;
};

export const updateTeacher = async (id: string, data: Partial<ITeacher>) => {
  if (!Types.ObjectId.isValid(id)) return null;

  return await TeacherModel.findByIdAndUpdate(id, data, { new: true }).lean();
};