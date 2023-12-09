const util = require("util");
const exec = util.promisify(require("child_process").exec);
let lastCameraState = 0;

async function getState() {
  const os = process.platform;
  let cameraState = 0;
  switch (os) {
    case "darwin":
      cameraState = await getStateMac();
      break;
  }

  return cameraState;
}

async function getStateMac() {
  let cameraStateBinary;
  const command =
    "log show --predicate 'subsystem contains \"com.apple.UVCExtension\" and composedMessage contains \"Post PowerLog\"' --last 1d | grep -E -o '\"VDCAssistant_Power_State\" = [a-zA-Z]+' | tail -1 | awk '{print $3}'";

  const cameraState = await runShellCommand(command);

  if (cameraState == "On") {
    cameraStateBinary = 1;
  } else if (cameraState == "Off") {
    cameraStateBinary = 0;
  }

  return cameraStateBinary;
}

async function runShellCommand(command) {
  try {
    const { error, stdout, stderr } = await exec(command);
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    return stdout && stdout.trim();
  } catch (e) {
    console.error(e);
  }
}

function setLastState(state) {
  lastCameraState = state;
}

function hasTheStateChanged(state) {
  return state != lastCameraState;
}

module.exports = { hasTheStateChanged, setLastState, getState };