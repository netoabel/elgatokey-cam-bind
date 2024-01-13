import * as camera from "./camera";
import * as keylight from "./keylight";
import { logger } from "./util/logger/logger";
import yargs from "yargs/yargs";

const argv = parseArgv();

if (argv.toggle) {
  keylight.toggleState();
} else {
  init();
}

function init(): void {
  camera.watchCameraLogs({
    onData: async (cameraState: string | undefined) => {
      if (cameraState !== undefined) updateKeylightState(cameraState);
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

function parseArgv(): any {
  return yargs(process.argv.slice(2))
    .options({
      toggle: { type: "boolean", default: false },
      turn: { type: "string", demandOption: false },
    })
    .parseSync();
}
