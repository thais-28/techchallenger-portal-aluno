// src/tests/unit/postsRepository.test.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  findAllPosts,
  findPostById,
  createPost,
  deleteOnePost,
  updatePost,
} from "../../../src/repositories/postsRepository";
import { PostModel } from "../../../src/models/postModel";
import { IPostInput } from "../../../src/types/post";

describe("postsRepository", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // limpa a coleção antes de cada teste
    await PostModel.deleteMany({});
  });

  it("deve criar um post e retornar o objeto criado", async () => {
    const input: IPostInput = {
      title: "Título Teste",
      content: "Conteúdo Teste",
      author: "Autor Teste",
      subject: "Assunto Teste",
    };

    const created = await createPost(input);
    expect(created).toMatchObject(input);
    expect(created).toHaveProperty("_id");
  });

  it("deve encontrar posts com paginação e filtros", async () => {
    // insere 3 posts
    const docs = [
      { title: "A", content: "C", author: "X", subject: "S1" },
      { title: "B", content: "C", author: "Y", subject: "S2" },
      { title: "C", content: "C", author: "X", subject: "S3" },
    ] as IPostInput[];
    await PostModel.insertMany(docs);

    // filtro author = X, página 1, limite 1
    const results = await findAllPosts({ author: "X" }, { page: 1, limit: 1 });
    expect(results).toHaveLength(1);
    expect(results[0].author).toBe("X");

    // página 2
    const results2 = await findAllPosts({ author: "X" }, { page: 2, limit: 1 });
    expect(results2).toHaveLength(1);
    expect(results2[0].author).toBe("X");
  });

  it("deve retornar null em findPostById para ID inválido", async () => {
    const res = await findPostById("1234-invalido");
    expect(res).toBeNull();
  });

  it("deve retornar post em findPostById para ID válido", async () => {
    const doc = await PostModel.create({
      title: "X",
      content: "Y",
      author: "Z",
      subject: "W",
    });
    const found = await findPostById(doc._id.toString());
    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      _id: doc._id,
      title: "X",
      content: "Y",
      author: "Z",
      subject: "W",
    });
  });

  it("deve retornar false em deleteOnePost para ID inválido", async () => {
    const ok = await deleteOnePost("id-invalido");
    expect(ok).toBe(false);
  });

  it("deve deletar post e retornar true em deleteOnePost para ID válido", async () => {
    const doc = await PostModel.create({
      title: "Para deletar",
      content: "C",
      author: "A",
      subject: "S",
    });
    const ok = await deleteOnePost(doc._id.toString());
    expect(ok).toBe(true);

    const still = await PostModel.findById(doc._id);
    expect(still).toBeNull();
  });

  it("deve retornar null em updatePost para ID inválido", async () => {
    const upd = await updatePost("inválido", { title: "X" });
    expect(upd).toBeNull();
  });

  it("deve atualizar post e retornar o documento em updatePost para ID válido", async () => {
    const doc = await PostModel.create({
      title: "Antes",
      content: "C",
      author: "A",
      subject: "S",
    });
    const upd = await updatePost(doc._id.toString(), { title: "Depois" });
    expect(upd).not.toBeNull();
    expect(upd).toMatchObject({ _id: doc._id, title: "Depois" });
  });
});
