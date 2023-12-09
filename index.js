const camera = require("./camera.js");
const keylight = require("./keylight.js");
const UPDATE_INTERVAL_MS = 500;
let currentCameraState = 0;

setInterval(updateKeylightState, UPDATE_INTERVAL_MS);

async function updateKeylightState() {
  const cameraState = await camera.getCameraState();
  if (cameraState !== undefined && hasTheCameraStateChanged(cameraState)) {
    console.log(
      `Camera state changed. Updating Elgato Key Light to the new state: ${cameraState}`
    );
    keylight.setState(cameraState); //TODO: currentCameraState shouldn't be updated when this fails
    currentCameraState = cameraState;
  }
}

function hasTheCameraStateChanged(state) {
  return state != currentCameraState;
}
