const camera = require("./camera.js");
const keylight = require("./keylight.js");
const UPDATE_INTERVAL_MS = 1000;

setInterval(updateKeylightState, UPDATE_INTERVAL_MS);

async function updateKeylightState() {
  const cameraState = await camera.getState();
  if (cameraState !== undefined && camera.hasTheStateChanged(cameraState)) {
    console.log(
      `Camera state changed. Updating Elgato Key Light to the new state: ${cameraState}`
    );
    try {
      await keylight.setState(cameraState);
      camera.setLastState(cameraState);
    } catch (e) {
      console.log(e);
    }
  }
}
