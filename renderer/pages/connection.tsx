'use client';

import { useEffect, useRef, useState } from 'react';
import { DeviceInfo, DeviceMethod, DeviceType, ScreenInfo } from '../types';
import PageLoader from '../components/page-load';
import { Dialog, DialogContent } from '../components/ui/dialog';
import {
  ChevronsLeftRightEllipsis,
  FolderInput,
  Loader2,
  Redo,
  Upload,
  X,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { ScreenCarousel } from '../components/screen-carousel';
import Suspended from '../customTemplates/Suspended';
import Batteryempty from '../customTemplates/Batteryempty';
import Overheating from '../customTemplates/Overheating';
import Poweroff from '../customTemplates/Poweroff';
import Rebooting from '../customTemplates/Rebooting';
import Starting from '../customTemplates/Starting';

function ConnectingModal({
  connected,
  connectionFailed,
  retry,
  back,
}: {
  connected: boolean;
  connectionFailed: boolean;
  retry: () => void;
  back: () => void;
}) {
  return (
    <Dialog open={!connected || connectionFailed}>
      <DialogContent className='flex flex-col items-center p-10'>
        {connectionFailed ? (
          <>
            <div className='mb-4 flex flex-row gap-2'>
              <XCircle className='m-auto size-8' />
              <h1 className='text-3xl font-bold'>Connection Failed</h1>
            </div>
            <p className='text-lg text-center'>
              Failed to connect to your device. Please check that your device is
              on and not on the sleep screen and that your device IP address has
              not changed.
            </p>
            <div className='w-full flex flex-row gap-3 mt-6'>
              <Button
                variant='outline'
                size='lg'
                className='w-full'
                onClick={back}
              >
                Back
              </Button>
              <Button
                variant='default'
                size='lg'
                className='w-full text-background'
                onClick={retry}
              >
                Retry
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='mb-4 flex flex-row gap-2'>
              <ChevronsLeftRightEllipsis className='m-auto size-8' />
              <h1 className='text-3xl font-bold'>Connecting</h1>
            </div>
            <div className='flex items-center justify-center'>
              <Loader2 className='size-12 animate-spin' />
            </div>
            <Button
              variant='outline'
              size='lg'
              className='mt-6 w-full'
              onClick={back}
            >
              Cancel
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Connection() {
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(0);
  const [heartbeatInterval, setHeartbeatInterval] =
    useState<NodeJS.Timeout | null>();
  const [retryCount, setRetryCount] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [savedScreens, setSavedScreens] = useState<ScreenInfo[]>([]);
  const [remoteScreens, setRemoteScreens] = useState<ScreenInfo[]>([]);
  const [selectedSavedScreen, setSelectedSavedScreen] =
    useState<ScreenInfo | null>(null);
  const [selectedRemoteScreen, setSelectedRemoteScreen] =
    useState<ScreenInfo | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const heartbeatIntervalRef = useRef(heartbeatInterval);
  const connectionFailedRef = useRef(connectionFailed);
  const retryCountRef = useRef(retryCount);
  const connectedRef = useRef(connected);
  const lastHeartbeatRef = useRef(lastHeartbeat);

  useEffect(() => {
    heartbeatIntervalRef.current = heartbeatInterval;
    connectionFailedRef.current = connectionFailed;
    retryCountRef.current = retryCount;
    connectedRef.current = connected;
    lastHeartbeatRef.current = lastHeartbeat;
  }, [
    lastHeartbeat,
    connected,
    retryCount,
    connectionFailed,
    heartbeatInterval,
  ]);

  useEffect(() => {
    // Get query params
    const urlParams = new URLSearchParams(window.location.search);
    const displayName = urlParams.get('displayName');
    const type = urlParams.get('type') as DeviceType;
    const method = urlParams.get('method') as DeviceMethod;
    const host = urlParams.get('host');
    const port = parseInt(urlParams.get('port'));
    const username = urlParams.get('username');
    const password = urlParams.get('password');

    if (!host || !username || !password || !port) {
      window.location.href = `./main${window.isProd ? '.html' : ''}`;
      return;
    }

    // Get saved screens
    window.ipc.getScreens();
    window.ipc.on('get-screens-res', (screens: ScreenInfo[]) => {
      setSavedScreens(screens);
    });

    // Start ipc event listeners
    window.ipc.on('connect-device-res', (res: { connected: boolean }) => {
      setConnected(res.connected);
      setRetryCount(0);
      setLastHeartbeat(Date.now());

      // If connection failed, set connection failed state
      if (!res.connected) {
        setConnectionFailed(true);
      }
    });

    window.ipc.on('check-device-res', (res: { connected: boolean }) => {
      setLastHeartbeat(Date.now());
      if (res.connected !== connectedRef.current) {
        if (res.connected) {
          setRetryCount(0);
        }
        setConnected(res.connected);
      }
    });

    window.ipc.on('get-files-res', (res: ScreenInfo[]) => {
      setRemoteScreens(res);
    });

    setDeviceInfo({
      connection: {
        host,
        port,
        username,
        password,
      },
      displayName,
      type,
      method,
    });
  }, []);

  // Check connection every 5 seconds
  useEffect(() => {
    getFiles();

    const interval = setInterval(() => {
      checkConnection();
    }, 5000);

    setHeartbeatInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [connected]);

  // Clear heartbeat interval on unmount
  useEffect(() => {
    if (connectionFailed) {
      clearInterval(heartbeatIntervalRef.current);
    }
  }, [connectionFailed]);

  const checkConnection = () => {
    if (connectionFailedRef.current) {
      return;
    }

    if (connectedRef.current && Date.now() - lastHeartbeatRef.current > 10000) {
      setConnected(false);
      return;
    }

    if (!connectedRef.current && retryCountRef.current >= 3) {
      setConnectionFailed(true);
      return;
    }

    if (!connectedRef.current) {
      setRetryCount(retryCountRef.current + 1);
    }

    // Check if device is connected
    window.ipc.checkDevice();
  };

  const connectDevice = async () => {
    if (!deviceInfo) {
      return;
    }

    // Connect to device
    window.ipc.connectDevice(deviceInfo.connection);
  };

  const disconnectDevice = () => {
    window.ipc?.disconnectDevice();
    window.location.href = `./main${window.isProd ? '.html' : ''}`;
  };

  const getFiles = async () => {
    console.log('getfile', deviceInfo);
    if (!deviceInfo) {
      return;
    }

    window.ipc.getFiles(deviceInfo.connection);
  };

  const uploadScreen = async () => {
    if (!deviceInfo || !selectedSavedScreen || !selectedRemoteScreen) {
      return;
    }

    window.ipc.uploadFile({
      connection: deviceInfo.connection,
      screen: selectedRemoteScreen.name.split('.png')[0],
      file: selectedSavedScreen.dataUrl,
    });

    setShowUploadModal(false);
  };

  useEffect(() => {
    // Connect to device
    connectDevice();
  }, [deviceInfo]);

  if (!deviceInfo) {
    return <PageLoader />;
  }

  return (
    <div className='mt-20 h-full'>
      <div className='fixed top-0 pl-10 pt-16 w-max mr-10 right-0 flex flex-row'>
        <div className='flex flex-row gap-2'>
          <Button
            variant='default'
            className='text-background hover:bg-foreground cursor-default'
          >
            <div
              className={cn(
                'size-2.5 rounded-full m-auto',
                connected
                  ? 'bg-green-700 dark:bg-green-600'
                  : 'bg-amber-700 dark:bg-amber-600'
              )}
            />

            <h3 className='m-auto text-background'>
              {deviceInfo.displayName || 'reMarkable'}
            </h3>
          </Button>
          <Button
            size='icon'
            variant='destructive'
            onClick={disconnectDevice}
          >
            <X />
          </Button>
        </div>
      </div>

      <div className='flex flex-col items-center mt-32 mx-10 h-full'>
        <div className='w-full flex flex-row flex-wrap mt-6 m-auto justify-around'>
          <div className='w-full max-w-[calc(50vw_-_15rem)]'>
            <h1 className='text-2xl font-bold text-center'>Saved Screens</h1>
            <ScreenCarousel
              className='w-full max-w-[calc(50vw_-_15rem)]'
              screens={savedScreens}
              onSelect={setSelectedSavedScreen}
              titlePosition={'top'}
              showTitle={true}
              editableTitle={false}
              showDeleteButton={false}
              showDownloadButton={false}
              showScreenCountBar={false}
            />
          </div>

          {/* Center graphic */}
          <div className='w-min my-auto'>
            <Redo className='size-16 animate-fade-and-scale-in' />
          </div>

          <div className='w-full max-w-[calc(50vw_-_15rem)] my-auto'>
            <h1 className='text-2xl font-bold text-center'>
              {deviceInfo.displayName || 'Device'} Screens
            </h1>
            {remoteScreens && remoteScreens.length > 0 ? (
              <ScreenCarousel
                className='w-full max-w-[calc(50vw_-_15rem)]'
                screens={
                  remoteScreens
                    ? (remoteScreens.map((screen) => ({
                        id: screen.name,
                        name: screen.name,
                        dataUrl: screen.dataUrl,
                        addDate: new Date(),
                      })) as ScreenInfo[])
                    : []
                }
                onSelect={setSelectedRemoteScreen}
                titlePosition={'top'}
                showTitle={true}
                editableTitle={false}
                showDeleteButton={false}
                showDownloadButton={false}
                showScreenCountBar={false}
              />
            ) : (
              <div className='flex flex-col items-center gap-4 w-full max-w-[calc(50vw_-_15rem)] my-auto'>
                <h1 className='text-2xl font-bold'>
                  Unable to get device screens
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload button */}
      <Button
        className='text-background fixed bottom-5 left-1/2 -translate-x-1/2'
        onClick={() => setShowUploadModal(true)}
        disabled={
          !connected ||
          connectionFailed ||
          !selectedSavedScreen ||
          !selectedRemoteScreen
        }
      >
        <FolderInput /> Update Screen
      </Button>

      {/* Confirm upload modal */}
      <Dialog
        open={showUploadModal}
        onOpenChange={(open) => setShowUploadModal(open)}
      >
        <DialogContent className='flex flex-col items-center p-10'>
          <div className='mb-4 flex flex-row gap-2'>
            <Upload className='m-auto size-8' />
            <h1 className='text-3xl font-bold'>Update Screen</h1>
          </div>
          <p className='text-lg text-center'>
            Are you sure you want to upload a screen to your device? This will
            overwrite the current screen on your device. Make sure to back up
            your current screen if you want to keep it.
          </p>
          <div className='w-full flex flex-row gap-3 mt-6'>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='default'
              className='w-full text-background'
              onClick={uploadScreen}
            >
              Update Screen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Suspended
        theme={'light'}
        lostText={''}
        contactInfo={[]}
        download={false}
      />
      <Batteryempty
        theme={'light'}
        download={false}
      />
      <Overheating
        theme={'light'}
        download={false}
      />
      <Poweroff
        theme={'light'}
        download={false}
        lostText={''}
        contactInfo={[]}
      />
      <Rebooting
        theme={'light'}
        download={false}
      />
      <Starting
        theme={'light'}
        download={false}
      /> */}

      {/* Connecting modal */}
      <ConnectingModal
        connected={connected}
        connectionFailed={connectionFailed}
        retry={() => {
          setConnectionFailed(false);
          setRetryCount(0);
          connectDevice();
        }}
        back={disconnectDevice}
      />
    </div>
  );
}
