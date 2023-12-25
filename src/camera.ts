import { logger } from "./util/logger/logger";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

interface CameraLogCallbacks {
  onData?: (data: string) => void;
  onError?: (error: Error) => void;
}

function watchCameraLogs(callbacks: CameraLogCallbacks): void {
  const logs: ChildProcessWithoutNullStreams = spawn("log", [
    "stream",
    "--predicate",
    `subsystem contains "com.apple.UVCExtension" and composedMessage contains "Post PowerLog"`,
  ]);

  logs.stdout.setEncoding("utf8");
  logs.stdout.on("data", (data: string) => {
    const regex: RegExp = /"VDCAssistant_Power_State"\s*=\s*([A-Za-z]+)/;
    const match: RegExpExecArray | null = regex.exec(data);
    if (match) {
      const cameraState: string = match[1];
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

export { watchCameraLogs };
