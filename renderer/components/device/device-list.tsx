import React from 'react'
import { Wifi, Cable, Container, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DeviceInfo } from '../../types'
import { Button } from '../ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '../ui/context-menu'
import { ScrollArea } from '../ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'

export default function DeviceList({
  devices,
  aliveHosts,
  handleAddOrEditDevice,
  getDevices,
  setAddDevice
}: {
  devices: DeviceInfo[]
  aliveHosts: string[]
  handleAddOrEditDevice: (existingDevice: DeviceInfo) => void
  getDevices: () => void
  setAddDevice: (addDevice: boolean) => void
}) {
  const removeDevice = (id: string) => {
    window.ipc?.send('remove-device', id)
    getDevices()
  }

  return (
    <div className="m-auto flex flex-col">
      <ScrollArea className="h-fit max-h-72 w-full max-w-md overflow-x-auto overflow-y-scroll">
        <div className="my-4 flex w-full flex-col gap-3">
          {devices.map((device, index) => (
            <ContextMenu key={index}>
              <ContextMenuTrigger>
                <div
                  key={device.connection.host}
                  className="mx-1 flex flex-row gap-2 rounded-lg border p-2">
                  {/* Connection method icon */}
                  {device.method === 'wifi' && (
                    <Wifi className="m-auto mx-3 size-10" />
                  )}
                  {device.method === 'usb' && (
                    <Cable className="m-auto mx-3 size-10" />
                  )}
                  {device.method === 'redockable' && (
                    <Container className="m-auto mx-3 size-10" />
                  )}

                  {/* Main device content */}
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="inline text-lg">{device.displayName}</h1>
                    <div className="flex flex-row gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="inline">
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
                      <p className="text-muted-foreground justify-self-stretch text-sm">
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
                    className="text-background m-auto mr-3"
                    onClick={() =>
                      (window.location.href = `/connection?host=${device.connection.host}&port=${
                        device.connection.port
                      }&username=${device.connection.username}&password=${
                        device.connection.password
                      }&displayName=${device.displayName}&type=${
                        device.type
                      }&method=${device.method}`)
                    }>
                    <h3>Connect</h3>
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
                  className="text-destructive"
                  onClick={() => removeDevice(device.id)}>
                  Remove
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
      <Button
        variant="outline"
        className="m-auto mt-4"
        onClick={() => setAddDevice(true)}>
        <Plus className="size-6" /> Add Device
      </Button>
    </div>
  )
}
