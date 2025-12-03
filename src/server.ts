import createApp from "./app";
import { env } from "./config/env";
import initDB from "./config/mongodb"; // ⬅️ Conecta ao banco
import { seedDatabase } from "./config/seed";

async function main() {
  try {
    await initDB();
    await seedDatabase(); // ⬅️ Semeia dados de exemplo
    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`❤️ Server running at http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar a aplicação:", err);
    process.exit(1);
  }
}

main();
