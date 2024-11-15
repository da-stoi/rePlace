import path from 'path';
import { app, ipcMain, shell, Notification } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import Client from 'ssh2-sftp-client';
import { nativeTheme } from 'electron';
import {
  Connection,
  DeviceInfo,
  HostStatus,
  ScreenInfo,
  UserSettings,
} from '../renderer/types';
import ping from 'ping';
import Store from 'electron-store';
import checkForAppUpdate from './helpers/updateCheck';

Store.initRenderer(); // Initialize store in renderer process
export const store = new Store(); // Initialize store in main process

const isProd = process.env.NODE_ENV === 'production';

const sftp = new Client();

if (isProd) {
  serve({ directory: 'app' });
} else {
  // app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow: Electron.BrowserWindow;

(async () => {
  await app.whenReady();

  const isDarkMode = nativeTheme.shouldUseDarkColors;
  const isDarwin = process.platform === 'darwin';

  mainWindow = createWindow('main', {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1600,
    maxHeight: 1000,
    titleBarStyle: isDarwin ? 'hidden' : 'default',
    titleBarOverlay: true,
    backgroundColor: isDarkMode ? '#1c1917' : '#fafaf9',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Hide window buttons for 3 second splash screen animation
  if (isDarwin) {
    mainWindow.setWindowButtonVisibility(false);
    setTimeout(() => mainWindow.setWindowButtonVisibility(true), 3200);
  }

  // mainWindow.webContents.openDevTools({
  //   mode: 'detach',
  // });

  if (isProd) {
    await mainWindow.loadURL(`app://./index.html`);
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools({
      mode: 'detach',
    });
  }
})();

function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Promise timed out'));
    }, timeout);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

// Open external links in default browser
ipcMain.on('external-link', async (event, url) => {
  // Open in default browser
  shell.openExternal(url);
});

ipcMain.on(
  'notify',
  async (event, title: string, body: string, onClickEvent: string) => {
    new Notification({
      title,
      body,
    }).show();
  }
);

// Ping device list to detect alive hosts
ipcMain.on('ping-devices', async (event, devices: DeviceInfo[]) => {
  const aliveDevices: HostStatus[] = await Promise.all(
    devices.map(async (device) => {
      try {
        // Ping device ip
        const devicePing = await ping.promise.probe(device.connection.host, {
          timeout: 1,
        });

        return {
          id: device.id,
          alive: devicePing.alive || false,
        };
      } catch (err) {
        return {
          id: device.id,
          alive: false,
        };
      }
    })
  );

  event.reply(
    'ping-devices-res',
    aliveDevices.filter((device) => device)
  );
});

// Check if a device is connected
ipcMain.on('check-device', async (event) => {
  try {
    await promiseWithTimeout(sftp.list('/usr/share/remarkable'), 1500);
    event.reply('check-device-res', { connected: true });
  } catch (err) {
    event.reply('check-device-res', { connected: false });
  }
});

// Watch a connected device
ipcMain.on('connect-device', async (event, connection: Connection) => {
  sftp.end();

  try {
    sftp.end();

    await promiseWithTimeout(
      sftp.connect({
        host: connection.host,
        port: connection.port || 22,
        username: connection.username,
        password: connection.password,
        readyTimeout: 2000,
      }),
      3000
    );

    event.reply('connect-device-res', { connected: true });
  } catch (err) {
    event.reply('connect-device-res', { connected: false });
    console.log('Failed to connect to device:', err);
  }
});

// Disconnect from a connected device
ipcMain.on('disconnect-device', async (event) => {
  sftp.end();
  event.reply('disconnect-device-res', { disconnected: true });
});

// Add new device to user data
ipcMain.on('add-device', async (event, device: DeviceInfo) => {
  const editDevice = device.id !== undefined;

  if (editDevice) {
    // Remove old device
    let devices = store.get('devices', []) as DeviceInfo[];
    devices = devices.filter((d) => d.id !== device.id);
    store.set('devices', devices);
  } else {
    // Collect new device info
    const id = `${device.type}-${new Date().getTime()}`;
    const addDate = new Date();
    device.id = id;
    device.addDate = addDate;
  }

  // Update devices list
  let devices = store.get('devices', []) as DeviceInfo[];
  devices.push(device);
  store.set('devices', devices);

  // Return new device
  event.reply('add-device-res', device);
  return device;
});

// Get devices from user data
ipcMain.on('get-devices', async (event) => {
  const devices = store.get('devices', []) as DeviceInfo[];
  event.reply('get-devices-res', devices);
  return devices;
});

// Remove device from user data
ipcMain.on('remove-device', async (event, id) => {
  // Update devices list
  let devices = store.get('devices', []) as DeviceInfo[];
  devices = devices.filter((device) => device.id !== id);
  store.set('devices', devices);
});

ipcMain.on('get-files', async (event, connection) => {
  try {
    const files = await promiseWithTimeout(
      sftp.list('/usr/share/remarkable'),
      2000
    );

    const fileNames = files
      .map((file) => file.name)
      .filter((file) => {
        const screens = [
          'starting.png',
          'poweroff.png',
          'suspended.png',
          'batteryempty.png',
          'overheating.png',
          'rebooting.png',
        ];
        return file.includes('.png') && screens.includes(file);
      })
      .sort((a, b) => a.localeCompare(b));

    const images: ScreenInfo[] = await Promise.all(
      fileNames.map(async (fileName) => {
        const image = await sftp.get(`/usr/share/remarkable/${fileName}`);
        const dataUrl = `data:image/png;base64,${image.toString('base64')}`;
        return { id: fileName, name: fileName, dataUrl, addDate: new Date() };
      })
    );

    event.reply('get-files-res', images);
    return images;
  } catch (err) {
    event.reply('log', err);
    console.log('Failed to get files:', err);

    event.reply('get-files-res', { error: 'Could not connect to SFTP server' });
    return { error: 'Could not connect to SFTP server' };
  }
});

ipcMain.on('upload-file', async (event, { connection, screen, file }) => {
  const sftp = new Client();
  try {
    await sftp.connect({
      host: connection.host,
      port: 22,
      username: connection.username,
      password: connection.password,
      readyTimeout: 3000,
    });

    const buffer = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );
    await sftp.put(buffer, `/usr/share/remarkable/${screen}.png`);

    // Get updated files
    ipcMain.emit('get-files', event, connection);

    event.reply('upload-file', { success: true });
    return { success: true };
  } catch (err) {
    event.reply('log', err);
    console.log('Failed to upload file:', err);

    event.reply('upload-file-res', { error: 'Could not upload file' });
    return { error: 'Could not upload file' };
  }
});

ipcMain.on('update-user-setting', async (event, key, value) => {
  let userSettings = store.get('userSettings', {}) as UserSettings;

  userSettings = { ...userSettings, [key]: value };

  store.set('userSettings', userSettings);

  event.reply('get-user-settings-res', userSettings);
});

ipcMain.on('get-user-settings', async (event) => {
  const userSettings = store.get('userSettings', {});
  event.reply('get-user-settings-res', userSettings);
});

ipcMain.on('get-update', async (event) => {
  const preRelease = store.get('userSettings.preRelease', false) as boolean;
  const updateDetails = await checkForAppUpdate(preRelease);

  event.reply('get-update-res', updateDetails);
});

ipcMain.on('add-screen', async (event, screen: ScreenInfo) => {
  let screens = store.get('screens', []) as ScreenInfo[];

  if (screens.find((s) => s.id === screen.id)) {
    screens = screens.filter((s) => s.id !== screen.id); // Remove old screen
  }

  screens.push(screen);
  store.set('screens', screens);
  event.reply(
    'get-screens-res',
    screens.sort(
      (a, b) => new Date(a.addDate).getTime() - new Date(b.addDate).getTime()
    )
  );
});

ipcMain.on('get-screens', async (event) => {
  const screens = store.get('screens', []) as ScreenInfo[];
  event.reply(
    'get-screens-res',
    screens.sort(
      (a, b) => new Date(a.addDate).getTime() - new Date(b.addDate).getTime()
    )
  );
});

ipcMain.on('remove-screen', async (event, id) => {
  let screens = store.get('screens', []) as ScreenInfo[];
  screens = screens.filter((screen) => screen.id !== id);
  store.set('screens', screens);
  event.reply('get-screens-res', screens);
});
