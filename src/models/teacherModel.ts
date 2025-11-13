import mongoose from "mongoose";

export interface ITeacherModel {
  _id?: mongoose.Types.ObjectId;
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  disciplina: string;
  email: string;
  matricula: string;
  senha: string;
}

const TeacherSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    nascimento: { type: Date, required: true },
    telefone: { type: String, required: true },
    disciplina: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricula: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

TeacherSchema.set('autoIndex', true);

export const TeacherModel = mongoose.model("teachers", TeacherSchema);