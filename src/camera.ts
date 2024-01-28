import { logger } from "./util/logger/logger";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import os from "os";

interface CameraLogCallbacks {
  onData?: (data: string) => void;
  onError?: (error: Error) => void;
}

function watchCameraLogsMac(callbacks: CameraLogCallbacks): void {
  const logs = spawnCameraLogProcessMac();

  logs.stdout.setEncoding("utf8");
  logs.stdout.on("data", (data: string) => {
    const regex = /"VDCAssistant_Power_State"\s*=\s*([A-Za-z]+)/;
    const match = regex.exec(data);
    if (match) {
      const cameraState = match[1];
      if (callbacks.onData) {
        callbacks.onData(cameraState);
      }
    }
  });

  logs.stderr.setEncoding("utf8");
  logs.stderr.on("data", (error: Error) => {
    if (callbacks.onError) {
      callbacks.onError(error);
    }
  });

  logs.on("exit", (code: any) => {
    logger.error("child process exited with code " + code.toString());
  });
}

function watchCameraLogsLinux(callbacks: CameraLogCallbacks): void {
  const DEVICE_NAME = process.env.KEYCAM_DEVICE_NAME || "video0";
  const logs = spawnCameraLogProcessLinux(DEVICE_NAME);

  logs.stdout.setEncoding("utf8");
  logs.stdout.on("data", (data: string) => {
    const cameraState = data.indexOf(DEVICE_NAME) === -1 ? "Off" : "On";
    if (callbacks.onData) {
      callbacks.onData(cameraState);
    }
  });

  logs.stderr.setEncoding("utf8");
  logs.stderr.on("data", (error: Error) => {
    if (callbacks.onError) {
      callbacks.onError(error);
    }
  });

  logs.on("exit", (code: any) => {
    logger.error("child process exited with code " + code.toString());
  });
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

function spawnCameraLogProcessMac(): ChildProcessWithoutNullStreams {
  return spawn("log", [
    "stream",
    "--predicate",
    `subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"`,
  ]);
}

function spawnCameraLogProcessLinux(
  deviceName: string
): ChildProcessWithoutNullStreams {
  return spawn("lsof", ["-r", "1", `/dev/${deviceName}`]);
}

export { watchCameraLogs };
