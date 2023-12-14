const camera = require("./src/camera.js");
const keylight = require("./src/keylight.js");
const logger = require("./util/logger/logger.js");

const UPDATE_INTERVAL_MS = 100;

loop();

async function loop() {
  setTimeout(async () => {
    await updateKeylightState();
    await loop();
  }, UPDATE_INTERVAL_MS);
}

async function updateKeylightState() {
  const cameraState = await camera.getState();
  if (cameraState !== undefined && camera.hasTheStateChanged(cameraState)) {
    logger.info(
      `Camera state changed. Updating Elgato Key Light to the new state: ${cameraState}`
    );
    try {
      await keylight.setState(cameraState);
      camera.setLastState(cameraState);
    } catch (e) {
      logger.error(e);
    }
  }
}
