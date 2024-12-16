import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadURL("file://${__dirname}/../build/index.html");
  } else {
    win.loadURL("http://localhost:3000");
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("keylight-control", (event, args) => {
  console.log("Keylight Control:", args);
  // Here you would implement the actual control of the keylight
  // For now, we'll just log the actions
  switch (args.action) {
    case "turnOn":
      console.log("Turning keylight on");
      break;
    case "turnOff":
      console.log("Turning keylight off");
      break;
    case "setBrightness":
      console.log(`Setting brightness to ${args.value}%`);
      break;
  }
});
