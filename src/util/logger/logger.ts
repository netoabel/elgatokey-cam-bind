import * as winston from "winston";
import "winston-daily-rotate-file";
import * as os from "os";

const homedir: string = os.homedir();
const logDir: string = `${homedir}/Library/Logs/elgatokeycam`;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "elgatokeycam" },
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/%DATE%.error.log`,
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "7d",
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/%DATE%.combined.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "7d",
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export { logger };
