import * as camera from "./camera";
import * as keylight from "./keylight";
import * as worker from "./worker";
import { logger } from "./util/logger";

init();

function init(): void {
  camera.watchCameraLogs({
    onData: updateKeylightState,
    onError: (error: any) => logger.error(error),
  });
}

function updateKeylightState(newState: string): void {
  worker.run({
    action: async () => {
      await keylight.setState({ on: toBinary(newState) });
    },
  });
}

function toBinary(state: string): number {
  return state === "On" ? 1 : 0;
}
