import mongoose from "mongoose";

export interface IStudentModel {
  _id?: mongoose.Types.ObjectId;
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  turma: string;
  email: string;
  matricula: string;
  senha: string;
}

const StudentSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    nascimento: { type: Date, required: true },
    telefone: { type: String, required: true },
    turma: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricula: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

StudentSchema.set('autoIndex', true);

export const StudentModel = mongoose.model("students", StudentSchema);