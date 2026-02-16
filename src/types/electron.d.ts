/**
 * Type declarations for Electron API exposed through preload script
 */

export interface ElectronAPI {
  sendCommand: (channel: string, data: any) => Promise<any>
  sendQuery: (channel: string, data: any) => Promise<any>
  on: (channel: string, func: (...args: any[]) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
