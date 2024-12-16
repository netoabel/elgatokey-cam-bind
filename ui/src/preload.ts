import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel: string, args: any) => {
    ipcRenderer.send(channel, args)
  },
})

