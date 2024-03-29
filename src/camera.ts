import { logger } from "./util/logger/logger";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import os from "os";

const DEVICE_NAME = process.env.KEYCAM_DEVICE_NAME || "video0";
let currentCameraState = "Unknown";

interface CameraLogCallbacks {
  onData: (data: string) => void;
  onError: (error: Error) => void;
}

function getCurrentCameraState(): string {
  return currentCameraState;
}

function watchCameraLogs(callbacks: CameraLogCallbacks): void {
  const hostOS = os.platform();

  switch (hostOS) {
    case "darwin":
      watchCameraLogsMac(callbacks);
      break;
    case "linux":
      watchCameraLogsLinux(callbacks);
      break;
  }
}

function watchCameraLogsMac(callbacks: CameraLogCallbacks): void {
  const logs = spawnCameraStreamProcessMac();
  wacthStdout(logs, {
    onData: (data) => {
      const cameraState = getCameraStateFromLogMac(data);
      currentCameraState = cameraState;
      callbacks.onData(cameraState);
    },
    onError: callbacks.onError,
  });
}

function watchCameraLogsLinux(callbacks: CameraLogCallbacks): void {
  const logs = spawnCameraStreamProcessLinux(DEVICE_NAME);

  wacthStdout(logs, {
    onData: (data) => {
      const cameraState = getCameraStateFromLogLinux(data);

      if (cameraState !== currentCameraState) {
        currentCameraState = cameraState;
        callbacks.onData(cameraState);
      }
    },
    onError: callbacks.onError,
  });
}

function wacthStdout(
  process: ChildProcessWithoutNullStreams,
  callbacks: CameraLogCallbacks
): void {
  process.stdout.setEncoding("utf8");
  process.stdout.on("data", (data: string) => {
    if (callbacks.onData) {
      callbacks.onData(data);
    }
  });

  process.stderr.setEncoding("utf8");
  process.stderr.on("data", (error: Error) => {
    if (callbacks.onError) {
      callbacks.onError(error);
    }
  });

  process.on("exit", (code: any) => {
    logger.error("child process exited with code " + code.toString());
  });
}

function getCameraStateFromLogMac(log: string): string {
  const regex = /"VDCAssistant_Power_State"\s*=\s*([A-Za-z]+)/;
  const match = regex.exec(log);
  return match ? match[1] : "";
}

function getCameraStateFromLogLinux(log: string): string {
  return log.indexOf(DEVICE_NAME) === -1 ? "Off" : "On";
}

function spawnCameraStreamProcessMac(): ChildProcessWithoutNullStreams {
  return spawn("log", [
    "stream",
    "--predicate",
    `subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"`,
  ]);
}

function spawnCameraStreamProcessLinux(
  deviceName: string
): ChildProcessWithoutNullStreams {
  return spawn("lsof", ["-r", "1", `/dev/${deviceName}`]);
}

export { getCurrentCameraState, watchCameraLogs };
