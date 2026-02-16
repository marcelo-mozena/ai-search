import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Command handlers (CQRS Write)
  sendCommand: (channel: string, data: any) => {
    const validChannels = ['execute-command']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    }
  },
  // Query handlers (CQRS Read)
  sendQuery: (channel: string, data: any) => {
    const validChannels = ['execute-query']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    }
  },
  // Event listeners
  on: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['event-update']
    if (validChannels.includes(channel)) {
      const subscription = (_event: any, ...args: any[]) => func(...args)
      ipcRenderer.on(channel, subscription)
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  }
})
