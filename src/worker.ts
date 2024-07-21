import fastq from "fastq";
import { logger } from "./util/logger/logger";
import type { queueAsPromised } from "fastq";

const RETRY_INTERVAL_MS = 5000;
const WORKER_CONCURRENCY = 1;

type Command = {
  action: Function;
};

const cmdQueue: queueAsPromised<Command> = fastq.promise(
  onCommand,
  WORKER_CONCURRENCY,
);

async function onCommand(cmd: Command): Promise<void> {
  cmdQueue.pause();
  try {
    await cmd.action();
    cmdQueue.resume();
  } catch (error) {
    logger.error(
      `Error while executing command. Retrying in ${RETRY_INTERVAL_MS}ms.`,
    );
    setTimeout(() => onCommand(cmd), RETRY_INTERVAL_MS);
  }
}

function run(command: Command) {
  cmdQueue.push(command);
}

export { run };
