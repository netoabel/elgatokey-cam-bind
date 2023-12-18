const camera = require("./src/camera.js");
const keylight = require("./src/keylight.js");
const logger = require("./util/logger/logger.js");

init();

function init() {
  camera.watchCameraLogs({
    onStateUpdate: async (cameraState) => {
      if (cameraState !== undefined) {
        logger.info("Camera state changed. New state: " + cameraState);
        try {
          await keylight.setState(cameraState);
        } catch (error) {
          logger.error(error);
        }
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
