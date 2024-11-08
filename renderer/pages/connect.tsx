import { useEffect, useState } from 'react';
import Header from '../components/header';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Connection, DeviceInfo } from '../types';
import { cn } from '../lib/utils';
import { Cable, Ellipsis, Eye, EyeClosed, Plus, Wifi } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown';
import { ScrollArea } from '../components/ui/scroll-area';

// Step 0: Select device type
function DeviceSelector({
  existingDevices,
  cancel,
  deviceInfo,
  handleDeviceSelect,
}: {
  existingDevices: boolean;
  cancel: () => void;
  deviceInfo: DeviceInfo;
  handleDeviceSelect: (type: 'rm1' | 'rm2' | 'rmPro') => void;
}) {
  return (
    <>
      <h1 className='text-center text-2xl'>
        What type of device are you connecting to?
      </h1>
      <div className='flex flex-row gap-4 my-5'>
        <Button
          variant='outline'
          className={cn('size-28', deviceInfo.type === 'rm1' && 'outline')}
          onClick={() => handleDeviceSelect('rm1')}
        >
          <h1 className='text-xl'>rM 1</h1>
        </Button>
        <Button
          variant='outline'
          className={cn('size-28', deviceInfo.type === 'rm2' && 'outline')}
          onClick={() => handleDeviceSelect('rm2')}
        >
          <h1 className='text-xl'>rM 2</h1>
        </Button>
        <Button
          variant='outline'
          className={cn('size-28', deviceInfo.type === 'rmPro' && 'outline')}
          onClick={() => handleDeviceSelect('rmPro')}
        >
          <h1 className='text-xl'>rM Pro</h1>
        </Button>
      </div>
      {existingDevices && (
        <Button
          variant='ghost'
          onClick={cancel}
        >
          Cancel
        </Button>
      )}
    </>
  );
}

// Step 1: Select connection method
function ConnectionMethodSelector({
  deviceInfo,
  handleConnectionMethodSelect,
  back,
}: {
  deviceInfo: DeviceInfo;
  handleConnectionMethodSelect: (method: 'wifi' | 'usb') => void;
  back: () => void;
}) {
  return (
    <>
      <h1 className='text-2xl text-center'>Connection Method</h1>
      <div className='flex flex-row gap-4 my-4'>
        <Button
          variant='outline'
          className={cn(
            'flex flex-col size-28',
            deviceInfo.method === 'wifi' && 'outline'
          )}
          onClick={() => handleConnectionMethodSelect('wifi')}
        >
          <Wifi className='size-16' />
          <h1 className='text-xl'>Wi-Fi</h1>
        </Button>
        <Button
          variant='outline'
          className={cn(
            'flex flex-col size-28',
            deviceInfo.method === 'usb' && 'outline'
          )}
          onClick={() => handleConnectionMethodSelect('usb')}
        >
          <Cable className='size-16' />
          <h1 className='text-xl'>USB</h1>
        </Button>
      </div>
      <Button
        variant='ghost'
        onClick={back}
      >
        Back
      </Button>
    </>
  );
}

// Step 2: Configure connection details
function ConnectionDetails({
  deviceInfo,
  handleConnectionDetailsSubmit,
  back,
}: {
  deviceInfo: DeviceInfo;
  handleConnectionDetailsSubmit: (connection: Connection) => void;
  back: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [host, setHost] = useState(deviceInfo.connection?.host || '');
  const [username, setUsername] = useState(
    deviceInfo.connection?.username || ''
  );
  const [password, setPassword] = useState(
    deviceInfo.connection?.password || ''
  );

  return (
    <>
      <h1 className='text-2xl text-center'>Connection Details</h1>
      <div className='flex flex-col gap-2 my-4 w-72'>
        {(showAdvanced || deviceInfo.method === 'wifi') && (
          <div>
            <Label
              htmlFor='host'
              className='text-left'
            >
              IP Address (Host)
            </Label>
            <Input
              id='host'
              type='text'
              className='input'
              placeholder='10.11.99.1'
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </div>
        )}
        {showAdvanced && (
          <div>
            <Label
              htmlFor='username'
              className='text-left'
            >
              Username
            </Label>
            <Input
              id='username'
              type='text'
              accept='^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$'
              className='input'
              placeholder='root'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div>
          <Label
            htmlFor='password'
            className='text-left'
          >
            Password
          </Label>
          <div className='flex flex-row'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              className='inline'
              placeholder='abc123DEF'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='m-auto ml-2'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeClosed className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? 'Hide' : 'Show'} password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <span
          className='underline hover:no-underline cursor-pointer w-max m-auto inline select-none'
          onClick={() =>
            window?.ipc.send('external-link', 'https://remarkable.com/')
          }
        >
          {' '}
          Where do I find this?
        </span>
        <span
          className='text-sm underline hover:no-underline text-muted-foreground cursor-pointer w-max m-auto inline select-none'
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Basic' : 'Advanced'} Setup
        </span>
      </div>
      <div className='space-x-2'>
        <Button
          variant='ghost'
          onClick={back}
        >
          Back
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            handleConnectionDetailsSubmit({ host, username, password })
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
}

function SaveDevice({
  deviceInfo,
  handleDeviceSave,
  back,
}: {
  deviceInfo: DeviceInfo;
  handleDeviceSave: (displayName: string) => void;
  back: () => void;
}) {
  const [deviceName, setDeviceName] = useState('');

  return (
    <>
      <h1 className='text-2xl text-center'>Name Your Device</h1>
      <div className='flex flex-col gap-2 my-4 w-72'>
        <Label
          htmlFor='deviceName'
          className='text-left'
        >
          Device Name
        </Label>
        <Input
          id='deviceName'
          type='text'
          className='input'
          placeholder='My reMarkable'
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
      </div>
      <div className='space-x-2'>
        <Button
          variant='ghost'
          onClick={back}
        >
          Back
        </Button>
        <Button
          variant='outline'
          onClick={() => handleDeviceSave(deviceName)}
        >
          Save
        </Button>
      </div>
      <span className='underline hover:no-underline select-none cursor-pointer'>
        Connect without saving
      </span>
    </>
  );
}

function NewDevice({
  existingDevices,
  getDevices,
  setAddDevice,
}: {
  existingDevices: boolean;
  getDevices: () => void;
  setAddDevice: (addDevice: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({});

  // Back button
  const back = () => {
    setCurrentStep(currentStep - 1);
  };

  // Step 0: Select device type
  const handleDeviceSelect = (type: 'rm1' | 'rm2' | 'rmPro') => {
    setDeviceInfo({
      ...deviceInfo,
      type,
    });
    setCurrentStep(1);
  };

  // Step 1: Select connection method
  const handleConnectionMethodSelect = (method: 'wifi' | 'usb') => {
    setDeviceInfo({
      ...deviceInfo,
      method,
      connection: {
        host: method === 'usb' ? '10.11.99.1' : '',
        username: 'root',
        password: '',
      },
    });
    setCurrentStep(2);
  };

  // Step 2: Configure connection details
  const handleConnectionDetailsSubmit = (connection: Connection) => {
    setDeviceInfo({
      ...deviceInfo,
      connection,
    });
    setCurrentStep(3);
  };

  // Step 3a: Name and save device
  const handleDeviceSave = (displayName: string) => {
    // Save device
    const fullDeviceInfo = {
      ...deviceInfo,
      displayName,
    };

    try {
      console.log('fullDeviceInfo', fullDeviceInfo);
      window.ipc?.send('add-device', fullDeviceInfo);
      getDevices(); // Refresh devices
      setAddDevice(false); // Close add screen
    } catch (e) {
      console.error(e);
    }
  };

  const cancel = () => {
    setDeviceInfo({}); // Reset device info
    setAddDevice(false);
  };

  return (
    <>
      {/* <code>{JSON.stringify(deviceInfo, null, 2)}</code> */}
      {currentStep === 0 && (
        <DeviceSelector
          existingDevices={existingDevices}
          cancel={() => cancel()}
          deviceInfo={deviceInfo}
          handleDeviceSelect={handleDeviceSelect}
        />
      )}
      {currentStep === 1 && (
        <ConnectionMethodSelector
          deviceInfo={deviceInfo}
          handleConnectionMethodSelect={handleConnectionMethodSelect}
          back={back}
        />
      )}
      {currentStep === 2 && (
        <ConnectionDetails
          deviceInfo={deviceInfo}
          handleConnectionDetailsSubmit={handleConnectionDetailsSubmit}
          back={back}
        />
      )}
      {currentStep === 3 && (
        <SaveDevice
          deviceInfo={deviceInfo}
          handleDeviceSave={handleDeviceSave}
          back={back}
        />
      )}
    </>
  );
}

function DeviceManager({
  devices,
  getDevices,
  setAddDevice,
}: {
  devices: DeviceInfo[];
  getDevices: () => void;
  setAddDevice: (addDevice: boolean) => void;
}) {
  const removeDevice = (id: string) => {
    window.ipc?.send('remove-device', id);
    getDevices();
  };

  return (
    <>
      <h1 className='text-2xl text-center'>Your Devices</h1>
      {/* <code>{JSON.stringify(devices, null, 2)}</code> */}
      <ScrollArea className='max-h-72 h-fit w-full overflow-scroll'>
        <div className='flex flex-col gap-3 my-4 w-full'>
          {devices.map((device, index) => (
            <div
              key={device.connection.host}
              className='flex flex-row gap-2 border p-2 rounded-lg'
            >
              {/* Connection method icon */}
              {device.method === 'wifi' ? (
                <Wifi className='size-10 mx-3 m-auto' />
              ) : (
                <Cable className='size-10 mx-3 m-auto' />
              )}
              {/* Main device content */}
              <div className='flex flex-col w-full gap-1'>
                <h1 className='text-lg content-end'>{device.displayName}</h1>
                <p className='text-muted-foreground text-sm justify-self-stretch'>
                  {device.type === 'rm1'
                    ? 'rM 1'
                    : device.type === 'rm2'
                    ? 'rM 2'
                    : device.type === 'rmPro'
                    ? 'rM Pro'
                    : 'Unknown Device'}{' '}
                  | {device.connection.host}
                </p>
                {/* <p className='text-muted-foreground text-xs'>
                  Added {new Date(device.addDate).toLocaleDateString()}
                </p> */}
              </div>
              <Button
                variant='secondary'
                className='m-auto mr-3'
                onClick={() =>
                  (window.location.href = `/connection${
                    window.isProd ? '.html' : ''
                  }?host=${device.connection.host}&username=${
                    device.connection.username
                  }&password=${device.connection.password}&displayName=${
                    device.displayName
                  }&type=${device.type}&method=${device.method}`)
                }
              >
                Connect
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button
        variant='outline'
        // size='icon'
        onClick={() => setAddDevice(true)}
      >
        <Plus className='h-6 w-6' /> Add Device
      </Button>
    </>
  );
}

export default function Connect() {
  const [modalOpen, setModalOpen] = useState(false);
  const [devices, setDevices] = useState<DeviceInfo[]>([
    {
      id: 'rm2-1633660000000',
      addDate: new Date('2003-05-03'),
      type: 'rm2',
      method: 'wifi',
      connection: {
        host: '192.168.1.198',
        username: 'root',
        password: 'c8o6axKmX2',
      },
      displayName: "Daniel's rM2",
    },
    {
      id: 'rm2-1633660000001',
      addDate: new Date('2000-02-26'),
      type: 'rmPro',
      method: 'usb',
      connection: {
        host: '10.11.99.1',
        username: 'root',
        password: 'c8o6axKmX2',
      },
      displayName: "Lukas' rM Pro",
    },
  ]);
  const [addDevice, setAddDevice] = useState(false);

  // Open modal on page load
  useEffect(() => {
    getDevices();

    window.ipc.on('get-devices-res', (devices: DeviceInfo[]) => {
      console.log('devices', devices);
      setDevices(devices);
    });

    window.ipc.on;

    window.ipc.on('log', (msg: string) => {
      console.log(msg);
    });

    setModalOpen(true);
  }, []);

  const getDevices = () => {
    window.ipc?.send('get-devices', null);
  };

  return (
    <div className='mt-20'>
      <Dialog open={modalOpen}>
        <DialogContent className='flex flex-col items-center p-10'>
          {addDevice || devices.length <= 0 ? (
            <NewDevice
              getDevices={getDevices}
              setAddDevice={setAddDevice}
              existingDevices={devices.length > 0}
            />
          ) : (
            <DeviceManager
              getDevices={getDevices}
              setAddDevice={setAddDevice}
              devices={devices}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
