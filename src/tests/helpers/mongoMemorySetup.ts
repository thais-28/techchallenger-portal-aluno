import { MongoMemoryServer } from "mongodb-memory-server";

export async function createMongoMemoryServer(): Promise<MongoMemoryServer> {
  return await MongoMemoryServer.create();
}
