'use client';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Screens.module.css';
import NextImage from 'next/image';
import CurrentScreens from '../components/CurrentScreens';
import UploadScreen from '../components/UploadScreens';
import CreateScreen from '../components/CreateScreen';
import { Connection, ScreenFile } from '../types';
import { useTheme } from 'next-themes';
import { Button } from '../components/ui/button';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';

const Home: NextPage = () => {
  const [screenMode, setScreenMode] = useState<'upload' | 'create'>('upload');
  const [screenUpload, setScreenUpload] = useState<File | null>(null);
  const [screenSelect, setScreenSelect] = useState<string>('batteryempty');
  const [uploading, setUploading] = useState<boolean>(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [files, setFiles] = useState<ScreenFile[]>([]);
  const [subsequentDisconnectCount, updateSubsequentDisconnectCount] =
    useState<number>(0);
  const [initialFetch, setInitialFetch] = useState<boolean>(false);
  const { theme, systemTheme, setTheme } = useTheme();

  // IPC event listeners
  useEffect(() => {
    console.log(window);
    if (!window.ipc) {
      console.warn('ipc is not available on window');
      return;
    }

    window.ipc?.on('log', (arg) => {
      console.log('Received log:', arg);
    });

    window.ipc?.on('get-files-res', (files: ScreenFile[]) => {
      console.log('get-files-res', files);
      setFiles(files);
    });

    window.ipc?.on('upload-file-res', (success: boolean) => {
      if (success) {
        getFiles();
        alert('Upload successful!');
      } else {
        alert('Upload failed.');
      }
    });

    window.ipc?.on('read-user-data-res', (data: string) => {
      console.log('user data read res', data);
      if (data) {
        setConnection(JSON.parse(data));
      }
    });

    window.ipc?.on('message', (arg) => {
      console.log('Received message:', arg);
    });
  }, []);

  const getFiles = useCallback(async () => {
    console.log('connecting and getting files', connection);
    window.ipc?.send('get-files', connection);
  }, [subsequentDisconnectCount, connection]);

  // Get connection from file storage
  useEffect(() => {
    window.ipc?.send('read-user-data', null);
  }, [setConnection]);

  // Set connection in file storage
  function updateConnection(connection: Connection | null) {
    window.ipc?.send(
      'write-user-data',
      connection ? JSON.stringify(connection) : null
    );
    setConnection(connection);
  }

  // Get files on initial load
  useEffect(() => {
    if (!initialFetch) {
      getFiles();
      setInitialFetch(true);
    }
  }, [getFiles, initialFetch, setInitialFetch]);

  // useEffect(() => {
  //   let interval: any;
  //   if (subsequentDisconnectCount < 3) {
  //     interval = setInterval(() => {
  //       getFiles();
  //     }, 5000);
  //     return () => clearInterval(interval);
  //   } else {
  //     // Clear the interval if subsequentDisconnectCount is greater than or equal to 5
  //     clearInterval(interval);
  //   }
  // }, [getFiles, subsequentDisconnectCount]);

  // Respect system theme
  useEffect(() => {
    setTheme(systemTheme as 'light' | 'dark');
  }, [systemTheme, setTheme]);

  async function getImageDimensions(file: File) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function revertScreen(screen: string) {
    if (!connection) {
      alert('You must be connected to a reMarkable device to revert a screen.');
      return;
    }

    const confirmation = confirm(
      'Are you sure you want to revert this screen back to the original? This will overwrite the current screen.'
    );

    if (!confirmation) {
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    const dataUrl = await new Promise(async (resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(
        new File(
          [await (await fetch(`screens/${screen}.png`)).blob()],
          `${screen}.png`
        )
      );
    });

    // Replace application/octet-stream with image/png
    const dataUrlString = dataUrl as string;
    const imageDataUrl = dataUrlString.replace(
      'application/octet-stream',
      'image/png'
    );

    window.ipc?.send('upload-file', {
      connection,
      screen,
      file: imageDataUrl,
    });

    getFiles();

    setUploading(false);
  }

  function clearScreenUpload() {
    setScreenUpload(null);
    setScreenSelect('batteryempty');
    const input = document.getElementById('screenUpload') as HTMLInputElement;
    input.value = '';
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <div>
      <Head>
        <title>rePlace</title>
        <meta
          name='description'
          content='Mod your reMarkable the safe way'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <div className={styles.inlineHeader}>
        <NextImage
          src='/logo.png'
          width={50}
          height={50}
          alt={''}
        />
        <h1>rePlace</h1>
        <Button onClick={toggleTheme}>
          <Sun />
          <Moon />
        </Button>
      </div>

      <CurrentScreens
        connection={connection}
        updateConnection={updateConnection}
        files={files}
        setFiles={setFiles}
        getFiles={getFiles}
        setScreenSelect={setScreenSelect}
        revertScreen={revertScreen}
      />

      <br />

      {files && files.length > 0 ? (
        screenMode === 'upload' ? (
          <UploadScreen
            connection={connection}
            screenUpload={screenUpload}
            screenSelect={screenSelect}
            uploading={uploading}
            getImageDimensions={getImageDimensions}
            clearScreenUpload={clearScreenUpload}
            setScreenUpload={setScreenUpload}
            getFiles={getFiles}
            setScreenSelect={setScreenSelect}
            setScreenMode={setScreenMode}
          />
        ) : (
          <CreateScreen
            connection={connection}
            screenSelect={screenSelect}
            getFiles={getFiles}
            setScreenSelect={setScreenSelect}
            setScreenMode={setScreenMode}
          />
        )
      ) : (
        ''
      )}
    </div>
  );
};

export default Home;
