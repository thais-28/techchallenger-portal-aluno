import createApp from "./app";
import { env } from "./config/env";
import initDB from "./config/mongodb"; // ⬅️ Conecta ao banco

async function main() {
  try {
    await initDB();
    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`❤️ Server running at http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar a aplicação:", err);
    process.exit(1); // Encerra com erro
  }
}

main();
