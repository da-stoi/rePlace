'use client';

import { useEffect, useRef, useState } from 'react';
import { DeviceInfo } from '../types';
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
                variant='secondary'
                size='lg'
                className='mt-6 w-full'
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
    const type = urlParams.get('type') as 'rm1' | 'rm2' | 'rmPro';
    const method = urlParams.get('method') as 'wifi' | 'usb';
    const host = urlParams.get('host');
    const username = urlParams.get('username');
    const password = urlParams.get('password');

    if (!host || !username || !password) {
      return;
    }

    // Start ipc event listeners
    window.ipc.on('connect-device-res', (res: { connected: boolean }) => {
      console.log('connect-device', res.connected);
      setConnected(res.connected);
      setRetryCount(0);
      setLastHeartbeat(Date.now());

      // If connection failed, set connection failed state
      if (!res.connected) {
        setConnectionFailed(true);
      }
    });

    window.ipc.on('check-device-res', (res: { connected: boolean }) => {
      console.log('check-device', res.connected);
      setLastHeartbeat(Date.now());
      if (res.connected !== connectedRef.current) {
        if (res.connected) {
          setRetryCount(0);
        }
        setConnected(res.connected);
      }
    });

    setDeviceInfo({
      connection: {
        host,
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
    const interval = setInterval(() => {
      console.log('INTERVAL: Checking connection...');
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
    console.log(
      connectionFailedRef.current,
      connectedRef.current,
      lastHeartbeatRef.current,
      retryCountRef.current
    );

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
    console.log(window.ipc);

    window.ipc?.disconnectDevice();
    window.location.href = `./connect${window.isProd ? '.html' : ''}`;
  };

  useEffect(() => {
    console.log('Connection details changed, connecting  to device...');

    // Connect to device
    connectDevice();
  }, [deviceInfo]);

  if (!deviceInfo) {
    return <PageLoader />;
  }

  return (
    <div className='mt-20'>
      <div className='fixed top-0 p-10 w-full flex flex-row justify-between'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='bg-muted py-2 px-3 flex flex-row gap-2 rounded select-none'>
              <div
                className={cn(
                  'size-2.5 rounded-full m-auto',
                  connected ? 'bg-connected' : 'bg-disconnected'
                )}
              />

              <h3 className='m-auto'>{deviceInfo.displayName}</h3>
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
      {/* <code>{JSON.stringify(deviceInfo, null, 2)}</code> */}
      <ConnectingModal
        connected={connected}
        connectionFailed={connectionFailed}
        retry={() => {
          setConnectionFailed(false);
          setRetryCount(0);
          connectDevice();
        }}
        back={() => {
          window.location.href = './connect';
        }}
      />
    </div>
  );
}
