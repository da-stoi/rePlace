import type { IpcRendererEvent } from 'electron'
import { contextBridge, ipcRenderer } from 'electron'
import type { Connection, DeviceInfo, ScreenInfo } from '../renderer/types'

/*
  This is sorcery... In prod the program always runs. 
  In dev, sometimes you need the following. 
  Other times everything breaks and you need to comment it out.
  I gave up trying to understand why.
*/
declare global {
  interface Window {
    ipc: IpcHandler
    isProd: boolean
    platform: string
  }
}

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  // Send a notification
  notify: (title: string, body: string, onClickEvent: string) => {
    ipcRenderer.send('notify', title, body, onClickEvent)
  },
  // Add device
  addDevice: (device: DeviceInfo) => {
    ipcRenderer.send('add-device', device)
  },
  // Remove device
  removeDevice: (device: DeviceInfo) => {
    ipcRenderer.send('remove-device', device)
  },
  // Connect to a reMarkable device
  connectDevice: (connection: Connection) => {
    ipcRenderer.send('connect-device', connection)
  },
  // Check if a device is connected
  checkDevice: () => {
    ipcRenderer.send('check-device', null)
  },
  // Disconnect from a reMarkable device
  disconnectDevice: () => {
    ipcRenderer.send('disconnect-device', null)
  },
  // Get files from a reMarkable device
  getFiles: (connection: Connection) => {
    ipcRenderer.send('get-files', connection)
  },
  // Upload a file to a reMarkable device
  uploadFile: ({
    connection,
    screen,
    file
  }: {
    connection: Connection
    screen: string
    file: string
  }) => {
    ipcRenderer.send('upload-file', { connection, screen, file })
  },
  // Ping devices to check if they are alive
  pingDevices: (devices: DeviceInfo[]) => {
    ipcRenderer.send('ping-devices', devices)
  },
  // Get devices from user data
  getDevices: () => {
    ipcRenderer.send('get-devices', null)
  },
  // Link to an external URL
  externalLink: (url: string) => {
    ipcRenderer.send('external-link', url)
  },
  // Read user data
  getUserSettings: () => {
    ipcRenderer.send('get-user-settings', null)
  },
  // Write user data
  updateUserSetting: (
    key: string,
    value: string | number | object | boolean
  ) => {
    ipcRenderer.send('update-user-setting', key, value)
  },
  // Get rePlce update
  getUpdate: () => {
    ipcRenderer.send('get-update', null)
  },
  // Add screen
  addScreen: (screen: ScreenInfo) => {
    ipcRenderer.send('add-screen', screen)
  },
  // Remove screen
  removeScreen: (screenId: string) => {
    ipcRenderer.send('remove-screen', screenId)
  },
  // Get screens
  getScreens: () => {
    ipcRenderer.send('get-screens', null)
  }
}

const isProd = process.env.NODE_ENV === 'production'
const platform = process.platform

contextBridge.exposeInMainWorld('ipc', handler)
contextBridge.exposeInMainWorld('isProd', isProd)
contextBridge.exposeInMainWorld('platform', platform)

export type IpcHandler = typeof handler
