import * as camera from "./camera";
import * as keylight from "./keylight";
import { logger } from "./util/logger/logger";

init();

function init(): void {
  camera.watchCameraLogs({
    onData: async (cameraState: string | undefined) => {
      if (cameraState !== undefined) {
        try {
          switch (cameraState) {
            case "On":
              logger.info("Camera turned On. Turning Keylight On...");
              await keylight.turnOn();
              break;
            case "Off":
              logger.info("Camera turned Off. Turning Keylight Off...");
              await keylight.turnOff();
              break;
          }
        } catch (error) {
          logger.error(error);
        }
      }
    },
    onError: (error: any) => {
      logger.error(error);
    },
  });
}
