import * as camera from "./camera";
import * as keylight from "./keylight";
import { logger } from "./util/logger/logger";
import yargs from "yargs/yargs";

const argv = parseArgv();
const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 5000;

if (argv.toggle) {
  keylight.toggleState();
} else {
  init();
}

function init(): void {
  camera.watchCameraLogs({
    onData: async (cameraState: string) => {
      try {
        await updateKeylightState(cameraState);
      } catch (error) {
        logger.error(error);
        retry();
      }
    },
    onError: (error: any) => {
      logger.error(error);
    },
  });
}

async function updateKeylightState(newState: string): Promise<void> {
  switch (newState) {
    case "On":
      await keylight.turnOn();
      break;
    case "Off":
      await keylight.turnOff();
      break;
  }
}

function retry(count: number = 1): void {
  if (count <= MAX_RETRIES) {
    const nextRetryMs = count * RETRY_INTERVAL_MS;
    logger.info(`Retrying in ${nextRetryMs} ms...`);

    setTimeout(async () => {
      logger.info(`Retrying... [${count}]`);

      try {
        await updateKeylightState(camera.getCurrentCameraState());
      } catch (error) {
        logger.error(error);
        retry(count + 1);
      }
    }, nextRetryMs);
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
