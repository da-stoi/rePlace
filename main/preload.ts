import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Connection, DeviceInfo, ScreenInfo } from '../renderer/types';

/*
  This is sorcery... In prod the program always runs. 
  In dev, sometimes you need the following. 
  Other times everything breaks and you need to comment it out.
  I gave up trying to understand why.
*/
declare global {
  interface Window {
    ipc: IpcHandler;
    isProd: boolean;
    platform: string;
  }
}

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  // Send a notification
  notify: async (title: string, body: string, onClickEvent: string) => {
    ipcRenderer.send('notify', title, body, onClickEvent);
  },
  // Add device
  addDevice: async (device: DeviceInfo) => {
    ipcRenderer.send('add-device', device);
  },
  // Remove device
  removeDevice: async (device: DeviceInfo) => {
    ipcRenderer.send('remove-device', device);
  },
  // Connect to a reMarkable device
  connectDevice: async (connection: Connection) => {
    ipcRenderer.send('connect-device', connection);
  },
  // Check if a device is connected
  checkDevice: async () => {
    ipcRenderer.send('check-device', null);
  },
  // Disconnect from a reMarkable device
  disconnectDevice: async () => {
    ipcRenderer.send('disconnect-device', null);
  },
  // Get files from a reMarkable device
  getFiles: async (connection: Connection) => {
    ipcRenderer.send('get-files', connection);
  },
  // Upload a file to a reMarkable device
  uploadFile: async (data: string) => {
    ipcRenderer.send('upload-file', data);
  },
  // Ping devices to check if they are alive
  pingDevices: async (devices: DeviceInfo[]) => {
    ipcRenderer.send('ping-devices', devices);
  },
  // Get devices from user data
  getDevices: async () => {
    ipcRenderer.send('get-devices', null);
  },
  // Link to an external URL
  externalLink: async (url: string) => {
    ipcRenderer.send('external-link', url);
  },
  // Read user data
  getUserSettings: async () => {
    ipcRenderer.send('get-user-settings', null);
  },
  // Write user data
  updateUserSetting: async (key: string, value: any) => {
    ipcRenderer.send('update-user-setting', key, value);
  },
  // Get rePlce update
  getUpdate: async () => {
    ipcRenderer.send('get-update', null);
  },
  // Add screen
  addScreen: async (screen: ScreenInfo) => {
    ipcRenderer.send('add-screen', screen);
  },
  // Remove screen
  removeScreen: async (screenId: string) => {
    ipcRenderer.send('remove-screen', screenId);
  },
  // Get screens
  getScreens: async () => {
    ipcRenderer.send('get-screens', null);
  },
};

const isProd = process.env.NODE_ENV === 'production';
const platform = process.platform;

contextBridge.exposeInMainWorld('ipc', handler);
contextBridge.exposeInMainWorld('isProd', isProd);
contextBridge.exposeInMainWorld('platform', platform);

export type IpcHandler = typeof handler;
