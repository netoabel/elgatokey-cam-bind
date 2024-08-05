import fastq from "fastq";
import { logger } from "./util/logger";
import type { queueAsPromised } from "fastq";

const RETRY_INTERVAL_MS = 5000;
const WORKER_CONCURRENCY = 1;
const MAX_RETRIES = 10;

type Command = {
  action: Function;
};

const cmdQueue: queueAsPromised<Command> = fastq.promise(
  onCommand,
  WORKER_CONCURRENCY,
);

async function onCommand(cmd: Command, retryCount: number = 0): Promise<void> {
  cmdQueue.pause();
  try {
    await cmd.action();
    cmdQueue.resume();
  } catch (error) {
    logger.error("Error while executing command.");
    if (retryCount < MAX_RETRIES) {
      logger.error(
        `Retrying (${retryCount + 1}) in ${RETRY_INTERVAL_MS} ms. Current queue size: ${cmdQueue.length()}.`,
      );
      setTimeout(() => onCommand(cmd, retryCount + 1), RETRY_INTERVAL_MS);
    } else {
      cmdQueue.resume();
    }
  }
}

function run(command: Command) {
  cmdQueue.push(command);
}

export { run };
