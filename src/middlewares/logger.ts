import winston, { Logger } from "winston";
import schedule from "node-schedule";
import fs from "fs";
import path from "path";

let logger: Logger;
let errorLogger: Logger;

const createLoggers = (): void => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const folderName = `${year}-${month}-${day}`;
  const logDir = path.join(__dirname, "../../logs", folderName);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFilePath = path.join(logDir, "app.log");
  const errorLogFilePath = path.join(logDir, "errors.log");

  const customFormat = winston.format.printf(({ level, message, timestamp, metadata }) => {
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${level !== "info" ? message : ""}`;
    if (level === "info") {
      return `${logMessage}${JSON.stringify(message)}`;
    }
    if (metadata) {
      return `${logMessage} ${JSON.stringify(metadata || message)}`;
    }
    return logMessage;
  });

  logger = winston.createLogger({
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: logFilePath })],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
      customFormat
    ),
  });

  errorLogger = winston.createLogger({
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: errorLogFilePath })],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
      customFormat
    ),
  });
};

createLoggers();

schedule.scheduleJob("0 0 * * *", () => {
  createLoggers();
  logger.info("Loggers have been reset for the new day.");
});

process.on("SIGINT", () => {
  logger.info("Server is stopping...");
  process.exit(0);
});

export const info = (msg: unknown) => logger.info(msg);
export const warn = (msg: unknown) => logger.warn(msg);
export const error = (msg: unknown) => errorLogger.error(msg);
