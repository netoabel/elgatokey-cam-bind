const logger = require("../util/logger/logger.js");
const spawn = require("child_process").spawn;

function watchCameraLogs(callbacks) {
  const logs = spawn("log", [
    "stream",
    "--predicate",
    `subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"`,
  ]);

  logs.stdout.setEncoding("utf8");
  logs.stdout.on("data", (data) => {
    const regex = /"VDCAssistant_Power_State"\s*=\s*([A-Za-z]+)/;
    const match = data.toString().match(regex);
    const cameraState = match && match[1];
    let cameraStateBinary;
    switch (cameraState) {
      case "On":
        cameraStateBinary = 1;
        break;
      case "Off":
        cameraStateBinary = 0;
        break;
    }
    callbacks.onStateUpdate(cameraStateBinary);
  });

  logs.stderr.setEncoding("utf8");
  logs.stderr.on("data", (data) => {
    callbacks.onError(data);
  });

  logs.on("exit", (code) => {
    logger.error("child process exited with code " + code.toString());
  });
}

module.exports = {
  watchCameraLogs,
};
