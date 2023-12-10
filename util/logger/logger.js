const winston = require("winston");
require("winston-daily-rotate-file");

const homedir = require("os").homedir();

const logDir = `${homedir}/Library/Logs/elgatokeycam`;

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
      maxSize: "10m",
      maxFiles: "7d",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD hh:mm:ss A ZZ",
        }),
        winston.format.json()
      ),
      handleExceptions: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/%DATE%.info.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "7d",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD hh:mm:ss A ZZ",
        }),
        winston.format.json()
      ),
      handleExceptions: true,
    }),
  ],
});

module.exports = logger;
