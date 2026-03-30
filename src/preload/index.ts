import { contextBridge, ipcRenderer } from 'electron'

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('relay', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  closePopup: () => ipcRenderer.invoke('close-popup')
})

// TypeScript type definitions for the exposed API
declare global {
  interface Window {
    relay: {
      openExternal: (url: string) => Promise<void>
      closePopup: () => Promise<void>
    }
  }
}
