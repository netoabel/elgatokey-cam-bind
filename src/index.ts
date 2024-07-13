import * as camera from "./camera";
import * as keylight from "./keylight";
import { logger } from "./util/logger/logger";
import yargs from "yargs/yargs";
import fastq from "fastq";
import type { queueAsPromised } from "fastq";

type Event = {
  on: boolean;
};

const argv = parseArgv();
const RETRY_INTERVAL_MS = 5000;
const WORKER_CONCURRENCY = 1;

if (argv.toggle) {
  keylight.toggleState();
} else {
  init();
}

const cmdQueue: queueAsPromised<Event> = fastq.promise(
  worker,
  WORKER_CONCURRENCY,
);

async function worker(evt: Event): Promise<void> {
  cmdQueue.pause();
  console.log(`Setting keylight state to ${evt.on}`);
  try {
    await keylight.setState(evt.on);
    cmdQueue.resume();
  } catch (error) {
    logger.error(
      `Error while setting Keylight state. Retrying in ${RETRY_INTERVAL_MS}ms.`,
    );
    setTimeout(() => worker(evt), RETRY_INTERVAL_MS);
  }
}

function init(): void {
  camera.watchCameraLogs({
    onData: async (cameraState: string) => {
      await updateKeylightState(cameraState);
    },
    onError: (error: any) => {
      logger.error(error);
    },
  });
}

async function updateKeylightState(newState: string): Promise<void> {
  switch (newState) {
    case "On":
      cmdQueue.push({ on: true });
      break;
    case "Off":
      cmdQueue.push({ on: false });
      break;
  }
}

function parseArgv(): any {
  return yargs(process.argv.slice(2))
    .options({
      toggle: { type: "boolean", default: false },
      turn: { type: "string", demandOption: false },
    })
    .parseSync();
}
