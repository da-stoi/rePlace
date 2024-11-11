import { Wifi, Cable, Container, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { DeviceInfo } from '../types';
import { Button } from './ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './ui/context-menu';
import { ScrollArea } from './ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export default function DeviceManager({
  devices,
  aliveHosts,
  handleAddOrEditDevice,
  getDevices,
  setAddDevice,
}: {
  devices: DeviceInfo[];
  aliveHosts: string[];
  handleAddOrEditDevice: (existingDevice: DeviceInfo) => void;
  getDevices: () => void;
  setAddDevice: (addDevice: boolean) => void;
}) {
  const removeDevice = (id: string) => {
    window.ipc?.send('remove-device', id);
    getDevices();
  };

  return (
    <>
      {/* <h1 className='text-2xl text-center'>Your Devices</h1> */}
      <ScrollArea className='max-h-72 h-fit max-w-md w-full overflow-y-scroll overflow-x-auto'>
        <div className='flex flex-col gap-3 my-4 w-full'>
          {devices.map((device, index) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  key={device.connection.host}
                  className='flex flex-row gap-2 border p-2 rounded-lg mx-1'
                >
                  {/* Connection method icon */}
                  {device.method === 'wifi' && (
                    <Wifi className='size-10 mx-3 m-auto' />
                  )}
                  {device.method === 'usb' && (
                    <Cable className='size-10 mx-3 m-auto' />
                  )}
                  {device.method === 'redockable' && (
                    <Container className='size-10 mx-3 m-auto' />
                  )}

                  {/* Main device content */}
                  <div className='flex flex-col w-full gap-1'>
                    <h1 className='text-lg inline'>{device.displayName}</h1>
                    <div className='flex flex-row gap-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className='inline'>
                            <div
                              className={cn(
                                'size-3 rounded-full',
                                aliveHosts.includes(device.id)
                                  ? 'bg-green-600 dark:bg-green-700'
                                  : 'bg-amber-600 dark:bg-amber-700'
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {aliveHosts.includes(device.id) ? (
                              <p>Device found</p>
                            ) : (
                              <p>Device not found</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className='text-muted-foreground text-sm justify-self-stretch'>
                        {device.type === 'rm1'
                          ? 'rM 1'
                          : device.type === 'rm2'
                          ? 'rM 2'
                          : device.type === 'rmpro'
                          ? 'rM Pro'
                          : device.type === 'redockable'
                          ? 'reDockable'
                          : 'Unknown Device'}{' '}
                        | {device.connection.host}
                      </p>
                    </div>
                  </div>
                  <Button
                    className='m-auto mr-3 text-background'
                    onClick={() =>
                      (window.location.href = `/connection${
                        window.isProd ? '.html' : ''
                      }?host=${device.connection.host}&port=${
                        device.connection.port
                      }&username=${device.connection.username}&password=${
                        device.connection.password
                      }&displayName=${device.displayName}&type=${
                        device.type
                      }&method=${device.method}`)
                    }
                  >
                    Connect
                  </Button>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>{device.displayName}</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleAddOrEditDevice(device)}>
                  Edit
                </ContextMenuItem>
                <ContextMenuItem
                  className='text-destructive'
                  onClick={() => removeDevice(device.id)}
                >
                  Remove
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
      <Button
        variant='outline'
        onClick={() => setAddDevice(true)}
      >
        <Plus className='h-6 w-6' /> Add Device
      </Button>
    </>
  );
}
