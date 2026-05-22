import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.info(`Expense Tracker API running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
