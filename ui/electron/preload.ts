import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  sendMessage: (channel: string, args: any) => {
    ipcRenderer.send(channel, args);
  },
  // Add any other methods you need to expose to the renderer
});

// Add this type declaration
declare global {
  interface Window {
    electron: {
      sendMessage: (channel: string, args: any) => void;
    };
  }
}
