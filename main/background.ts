import path from 'path';
import { app, ipcMain, shell } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { nativeTheme } from 'electron';
import { Connection, DeviceInfo } from '../renderer/types';

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

  mainWindow = createWindow('main', {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    backgroundColor: isDarkMode ? '#212121' : '#efefef',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Hide window buttons for 3 second splash screen animation
  mainWindow.setWindowButtonVisibility(false);
  setTimeout(() => mainWindow.setWindowButtonVisibility(true), 3200);

  if (isProd) {
    await mainWindow.loadURL('app://./');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    // mainWindow.webContents.openDevTools();
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
        port: 22,
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

const userDataPath = path.join(app.getPath('userData'), 'user-data.json');

// // Read user data
// ipcMain.on('read-user-data', async (event) => {
//   try {
//     const data = fs.readFileSync(userDataPath, { encoding: 'utf-8' });
//     event.reply('read-user-data-res', data);
//     return data;
//   } catch (err) {
//     console.log('Failed to read user data:', err);
//     event.reply('read-user-data-res', null);
//     return null;
//   }
// });

// // Write user data
// ipcMain.on('write-user-data', async (event, data) => {
//   try {
//     if (data === null) {
//       fs.unlinkSync(userDataPath);
//     } else {
//       fs.writeFileSync(userDataPath, data, { encoding: 'utf-8' });
//     }
//   } catch (err) {
//     console.log('Failed to write user data:', err);
//   }
// });

// Add new device to user data
ipcMain.on('add-device', async (event, device: DeviceInfo) => {
  const id = `${device.type}-${new Date().getTime()}`;
  const addDate = new Date();
  device.id = id;
  device.addDate = addDate;

  try {
    const data = fs.readFileSync(userDataPath, { encoding: 'utf-8' });
    const userData = JSON.parse(data);
    const newUserData = {
      ...userData,
      devices:
        userData?.devices && userData?.devices.length > 0
          ? [...userData.devices, device]
          : [device],
    };

    console.log('newUserData', newUserData);

    event.reply('log', newUserData);

    fs.writeFileSync(userDataPath, JSON.stringify(newUserData), {
      encoding: 'utf-8',
    });
  } catch (err) {
    console.log('Failed to add device:', err);
    event.reply('log', err);
  }
});

// Get devices from user data
ipcMain.on('get-devices', async (event) => {
  console.log('get-devices');

  try {
    const data = fs.readFileSync(userDataPath, { encoding: 'utf-8' });
    const userData = JSON.parse(data);
    event.reply('get-devices-res', userData.devices);
    return userData.devices;
  } catch (err) {
    console.log('Failed to get devices:', err);
    event.reply('get-devices-res', []);
    return [];
  }
});

// Remove device from user data
ipcMain.on('remove-device', async (event, id) => {
  try {
    const data = fs.readFileSync(userDataPath, { encoding: 'utf-8' });
    const userData = JSON.parse(data);
    const newUserData = {
      ...userData,
      devices: userData.devices.filter(
        (device: DeviceInfo) => device.id !== id
      ),
    };

    fs.writeFileSync(userDataPath, JSON.stringify(newUserData), {
      encoding: 'utf-8',
    });
  } catch (err) {
    console.log('Failed to remove device:', err);
  }
});

ipcMain.on('get-files', async (event, connection) => {
  // Check sftp connection
  try {
    const listRes = await sftp.list('/usr/share/remarkable');

    event.reply('log', 'Connected to SFTP server');
  } catch (err) {
    console.log('Failed to connect to SFTP server:', err);
    event.reply('log', { error: 'Could not connect to SFTP server' });
    return { error: 'Could not connect to SFTP server' };
  }

  try {
    await sftp.connect({
      host: connection.host,
      port: 22,
      username: connection.username,
      password: connection.password,
      readyTimeout: 3000,
    });

    const files = await sftp.list('/usr/share/remarkable');

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

    const images = await Promise.all(
      fileNames.map(async (fileName) => {
        const image = await sftp.get(`/usr/share/remarkable/${fileName}`);
        const dataUrl = `data:image/png;base64,${image.toString('base64')}`;
        return { name: fileName, dataUrl };
      })
    );

    sftp.end();
    event.reply('get-files-res', images);
    return images;
  } catch (err) {
    event.reply('log', err);
    console.log('Failed to get files:', err);
    sftp.end();

    event.reply('get-files-res', { error: 'Could not connect to SFTP server' });
    return { error: 'Could not connect to SFTP server' };
  }
});

// ipcMain.on('get-files', async (event, connection) => {
//   const sftp = new Client();
//   try {
//     await sftp.connect({
//       host: connection.host,
//       port: 22,
//       username: connection.username,
//       password: connection.password,
//       readyTimeout: 3000,
//     });

//     const files = await sftp.list('/usr/share/remarkable');

//     const fileNames = files
//       .map((file) => file.name)
//       .filter((file) => {
//         const screens = [
//           'starting.png',
//           'poweroff.png',
//           'suspended.png',
//           'batteryempty.png',
//           'overheating.png',
//           'rebooting.png',
//         ];
//         return file.includes('.png') && screens.includes(file);
//       })
//       .sort((a, b) => a.localeCompare(b));

//     const images = await Promise.all(
//       fileNames.map(async (fileName) => {
//         const image = await sftp.get(`/usr/share/remarkable/${fileName}`);
//         const dataUrl = `data:image/png;base64,${image.toString('base64')}`;
//         return { name: fileName, dataUrl };
//       })
//     );

//     sftp.end();
//     event.reply('get-files-res', images);
//     return images;
//   } catch (err) {
//     event.reply('log', err);
//     console.log('Failed to get files:', err);
//     sftp.end();

//     event.reply('get-files-res', { error: 'Could not connect to SFTP server' });
//     return { error: 'Could not connect to SFTP server' };
//   }
// });

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

    sftp.end();
    event.reply('upload-file', { success: true });
    return { success: true };
  } catch (err) {
    event.reply('log', err);
    console.log('Failed to upload file:', err);
    sftp.end();

    event.reply('upload-file-res', { error: 'Could not upload file' });
    return { error: 'Could not upload file' };
  }
});
