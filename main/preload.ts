import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Connection } from '../renderer/types';

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
  // Connect to a reMarkable device
  connectDevice: async (connection: Connection) => {
    ipcRenderer.send('connect-device', connection);
  },
  // Check if a device is connected
  checkDevice: async () => {
    ipcRenderer.send('check-device', null);
  },
  disconnectDevice: async () => {
    ipcRenderer.send('disconnect-device', null);
  },
  // getFiles: async (connection) => {
  //   return await ipcRenderer.invoke('get-files', connection);
  // },
  // uploadFile: async (data) => {
  //   return await ipcRenderer.invoke('upload-file', data);
  // },
};

const isProd = process.env.NODE_ENV === 'production';

contextBridge.exposeInMainWorld('ipc', handler);
contextBridge.exposeInMainWorld('isProd', isProd);

export type IpcHandler = typeof handler;
