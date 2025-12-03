import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Cria uma inst\u00e2ncia do MongoDB Memory Server
 */
export async function createMongoMemoryServer(): Promise<MongoMemoryServer> {
  return await MongoMemoryServer.create();
}
