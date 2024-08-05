import * as camera from "./camera";
import * as keylight from "./keylight";
import * as worker from "./worker";
import { logger } from "./util/logger/logger";
import yargs from "yargs/yargs";

const argv = parseArgv();

if (argv.toggle) {
  worker.run({ action: keylight.toggleState });
} else {
  init();
}

function init(): void {
  camera.watchCameraLogs({
    onData: updateKeylightState,
    onError: (error: any) => logger.error(error),
  });
}

function updateKeylightState(newState: string): void {
  worker.run({
    action: async () => {
      await keylight.setState(toBoolean(newState));
    },
  });
}

function toBoolean(state: string) {
  return state === "On";
}

function parseArgv(): any {
  return yargs(process.argv.slice(2))
    .options({
      toggle: { type: "boolean", default: false },
    })
    .parseSync();
}
