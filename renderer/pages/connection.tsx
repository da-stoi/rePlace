'use client';

import { useEffect, useRef, useState } from 'react';
import { DeviceInfo, DeviceMethod, DeviceType, ScreenFile } from '../types';
import Header from '../components/header';
import PageLoader from '../components/page-load';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Cable, Loader2, Wifi } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown';
import Image from 'next/image';
import { ScreenCarousel } from '../components/screen-carousel';

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
            <h1 className='text-3xl font-bold mb-4'>Connection Failed</h1>
            <p className='text-lg text-center'>
              Failed to connect to your device. Please check that your device is
              on and not on the sleep screen and that your device IP address has
              not changed.
            </p>
            <div className='w-full flex flex-row gap-3'>
              <Button
                variant='outline'
                size='lg'
                className='mt-6 w-full'
                onClick={back}
              >
                Back
              </Button>
              <Button
                variant='default'
                size='lg'
                className='mt-6 w-full text-background'
                onClick={retry}
              >
                Retry
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className='text-3xl font-bold mb-4'>Connecting...</h1>
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
  const [screens, setScreens] = useState<ScreenFile[]>([]);

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

    window.ipc.on('get-files-res', (res: ScreenFile[]) => {
      setScreens(res);
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
    if (!deviceInfo) {
      return;
    }

    window.ipc.getFiles(deviceInfo.connection);
  };

  useEffect(() => {
    // Connect to device
    connectDevice();
  }, [deviceInfo]);

  if (!deviceInfo) {
    return <PageLoader />;
  }

  return (
    <div className='mt-20'>
      <div className='fixed top-0 pl-10 pt-16 w-max mr-10 right-0 flex flex-row'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='bg-foreground py-2 px-3 flex flex-row gap-2 rounded select-none'>
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
              {/* <p className='m-auto text-sm'>{deviceInfo.host}</p> */}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {connected ? 'Connected' : 'Disconnected'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={disconnectDevice}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button></Button> */}
      </div>

      <div className='flex flex-col items-center mt-32 mx-10'>
        <h1 className='text-3xl font-bold'>Screens</h1>
        <div className='w-full flex flex-row flex-wrap gap-4 mt-6 m-auto'>
          <ScreenCarousel />
          {screens &&
            screens.length > 0 &&
            screens.map((screen) => (
              <div
                key={screen.name}
                className='m-auto'
              >
                <Image
                  src={`${screen.dataUrl}`}
                  alt={screen.name}
                  className='rounded-md'
                  width={220}
                  height={280}
                />
              </div>
            ))}

          {screens.length === 0 && (
            <h3 className='text-xl text-center'>No screens found</h3>
          )}
        </div>
      </div>

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
