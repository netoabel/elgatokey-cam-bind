const util = require("util");
const logger = require("../util/logger/logger.js");
const exec = util.promisify(require("child_process").exec);

const LOG_COMMAND_TIMEOUT_MS = 5000;
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
  const command = `log show --predicate 'subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"' --last 1d | grep -E -o '"VDCAssistant_Power_State" = [a-zA-Z]+' | tail -1 | awk '{print $3}'`;
  const startTime = new Date();
  const cameraState = await runShellCommand(command);
  const endTime = new Date();

  // logger.info(
  //   cameraState +
  //     ". Response time in seconds: " +
  //     Math.abs(endTime - startTime) / 1000
  // );

  if (cameraState == "On") {
    cameraStateBinary = 1;
  } else if (cameraState == "Off") {
    cameraStateBinary = 0;
  }

  return cameraStateBinary;
}

async function runShellCommand(command) {
  try {
    const { error, stdout, stderr } = await exec(command, {
      timeout: LOG_COMMAND_TIMEOUT_MS,
    });
    if (error) {
      logger.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`stderr: ${stderr}`);
      return;
    }
    return stdout && stdout.trim();
  } catch (e) {
    logger.error(e);
  }
}

function setLastState(state) {
  lastCameraState = state;
}

function hasTheStateChanged(state) {
  return state != lastCameraState;
}

module.exports = { hasTheStateChanged, setLastState, getState };
