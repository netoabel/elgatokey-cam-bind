import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 362,
    height: 273,
    titleBarStyle: "customButtonsOnHover",
    frame: false,
    resizable: false,
    minimizable: true,
    maximizable: false,
    backgroundColor: "#1C1C1C",
    trafficLightPosition: { x: 10, y: 10 },
    icon: path.join(__dirname, "../assets/icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const indexPath = path.join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("keylight-control", async (_event, args) => {
  try {
    switch (args.action) {
      //Call the keylight methods
      case "turnOn":
        // await setState({ on: 1 });
        break;
      case "turnOff":
        // await setState({ on: 0 });
        break;
      case "setBrightness":
        // await setBrightness(args.value);
        break;
      default:
        console.error("Unknown action:", args.action);
    }
  } catch (error) {
    console.error("Failed to control Keylight:", error);
  }
});
