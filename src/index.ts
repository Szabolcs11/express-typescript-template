import "dotenv/config";
import app from "./app";
import { error, info } from "./middlewares/logger";
import { config } from "./config/default";

process.on("uncaughtException", (err) => {
  console.error("Caught an unhandled exception:", err);
  error(err.stack || err.message);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled promise rejection:", reason);
  error(reason);
});

const PORT = config.port || 3000;

app.listen(PORT, () => {
  info(`Server is running on port ${PORT}`);
  console.log(`Server listening on port ${PORT}`);
});
