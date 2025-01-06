import React from 'react'
import { Wifi, Cable, Eye, EyeOff } from 'lucide-react'
import { cn } from '../lib/utils'
import { DeviceInfo, DeviceType, DeviceMethod, Connection } from '../types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import { Label } from './ui/label'

// Step 0: Select device type
function DeviceSelector({
  existingDevices,
  deviceInfo,
  developerMode,
  cancel,
  handleDeviceSelect
}: {
  existingDevices: boolean
  deviceInfo: DeviceInfo
  developerMode: boolean
  cancel: () => void
  handleDeviceSelect: (type: DeviceType) => void
}) {
  return (
    <>
      <h1 className="text-center text-2xl">
        What type of device are you connecting to?
      </h1>
      <div className="my-5 flex flex-row gap-4">
        <Button
          variant="outline"
          className={cn('size-28', deviceInfo.type === 'rm1' && 'outline')}
          onClick={() => handleDeviceSelect('rm1')}>
          <h1 className="text-xl">rM 1</h1>
        </Button>
        <Button
          variant="outline"
          className={cn('size-28', deviceInfo.type === 'rm2' && 'outline')}
          onClick={() => handleDeviceSelect('rm2')}>
          <h1 className="text-xl">rM 2</h1>
        </Button>
        <Button
          variant="outline"
          className={cn('size-28', deviceInfo.type === 'rmpro' && 'outline')}
          onClick={() => handleDeviceSelect('rmpro')}>
          <h1 className="text-xl">rM Pro</h1>
        </Button>
      </div>
      {developerMode && (
        <Button
          variant="outline"
          className={cn('p-8', deviceInfo.type === 'redockable' && 'outline')}
          onClick={() => handleDeviceSelect('redockable')}>
          <h1 className="text-xl">reDockable</h1>
        </Button>
      )}
      {existingDevices && (
        <Button
          variant="secondary"
          onClick={cancel}
          className="mt-5">
          Cancel
        </Button>
      )}
    </>
  )
}

// Step 1: Select connection method
function ConnectionMethodSelector({
  deviceInfo,
  handleConnectionMethodSelect,
  back
}: {
  deviceInfo: DeviceInfo
  handleConnectionMethodSelect: (method: DeviceMethod) => void
  back: () => void
}) {
  return (
    <>
      <h1 className="text-center text-2xl">Connection Method</h1>
      <div className="my-4 flex flex-row gap-4">
        <Button
          variant="outline"
          className={cn(
            'flex size-28 flex-col',
            deviceInfo.method === 'wifi' && 'outline'
          )}
          onClick={() => handleConnectionMethodSelect('wifi')}>
          <Wifi className="size-16" />
          <h1 className="text-xl">Wi-Fi</h1>
        </Button>
        <Button
          variant="outline"
          className={cn(
            'flex size-28 flex-col',
            deviceInfo.method === 'usb' && 'outline'
          )}
          onClick={() => handleConnectionMethodSelect('usb')}>
          <Cable className="size-16" />
          <h1 className="text-xl">USB</h1>
        </Button>
      </div>
      <Button
        variant="secondary"
        onClick={back}>
        Back
      </Button>
    </>
  )
}

// Step 2: Configure connection details
function ConnectionDetails({
  deviceInfo,
  developerMode,
  handleConnectionDetailsSubmit,
  back
}: {
  deviceInfo: DeviceInfo
  startInAdvanced: boolean
  developerMode: boolean
  handleConnectionDetailsSubmit: (connection: Connection) => void
  back: () => void
}) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [host, setHost] = React.useState(deviceInfo?.connection?.host || '')
  const [port, setPort] = React.useState<number | ''>(
    deviceInfo?.connection?.port || 22
  )
  const [username, setUsername] = React.useState(
    deviceInfo?.connection?.username || ''
  )
  const [password, setPassword] = React.useState(
    deviceInfo?.connection?.password || ''
  )

  return (
    <>
      <h1 className="text-center text-2xl">Connection Details</h1>
      <div className="my-4 flex w-72 flex-col gap-2">
        {(deviceInfo.method === 'wifi' || developerMode) && (
          <div className="flex flex-row gap-4">
            <div className={cn(developerMode ? 'basis-3/4' : 'basis-full')}>
              <Label
                htmlFor="host"
                className="text-left">
                IP Address (Host)<span className="text-destructive">*</span>
              </Label>
              <Input
                id="host"
                type="text"
                className="input"
                placeholder="10.11.99.1"
                value={host}
                onChange={e => setHost(e.target.value)}
              />
            </div>
            {developerMode && (
              <div className="basis-1/4">
                <Label
                  htmlFor="host"
                  className="text-left">
                  Port<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="host"
                  type="number"
                  className="input"
                  placeholder="22"
                  value={port}
                  onChange={e =>
                    setPort(
                      Number.isNaN(parseInt(e.target.value))
                        ? e.target.value === ''
                          ? ''
                          : 22
                        : parseInt(e.target.value)
                    )
                  }
                />
              </div>
            )}
          </div>
        )}
        {developerMode && (
          <div>
            <Label
              htmlFor="username"
              className="text-left">
              Username<span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              accept="^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$"
              className="input"
              placeholder="root"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
        )}
        <div>
          <Label
            htmlFor="password"
            className="text-left">
            Password<span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-row">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="inline"
              placeholder="abc123DEF"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="m-auto ml-2"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only"></span>
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
          className="text-muted-foreground m-auto inline w-max cursor-pointer select-none underline hover:no-underline"
          onClick={() =>
            window.ipc.externalLink(
              'https://remarkable.guide/guide/access/ssh.html#finding-your-device-password-and-ip-addresses'
            )
          }>
          Where do I find this?
        </span>
      </div>
      <div className="space-x-2">
        <Button
          variant="secondary"
          onClick={back}>
          Back
        </Button>
        <Button
          className="text-background"
          disabled={!host || !username || !password || !port}
          onClick={() =>
            handleConnectionDetailsSubmit({
              host,
              port: !Number.isNaN(parseInt(String(port)))
                ? parseInt(String(port))
                : 22,
              username,
              password
            })
          }>
          Continue
        </Button>
      </div>
    </>
  )
}

// Step 3: Save device
function SaveDevice({
  deviceInfo,
  editingDevice,
  handleDeviceSave,
  back
}: {
  deviceInfo: DeviceInfo
  editingDevice: DeviceInfo
  handleDeviceSave: (displayName: string) => void
  back: () => void
}) {
  const [deviceName, setDeviceName] = React.useState(
    editingDevice.displayName || ''
  )

  return (
    <>
      <h1 className="text-center text-2xl">Name Your Device</h1>
      <div className="mt-4 flex w-72 flex-col gap-2">
        <Label
          htmlFor="deviceName"
          className="text-left">
          Device Name
        </Label>
        <Input
          id="deviceName"
          type="text"
          className="input"
          placeholder="My reMarkable"
          value={deviceName}
          onChange={e => setDeviceName(e.target.value)}
        />
      </div>
      <span
        className="text-muted-foreground mb-4 cursor-pointer select-none underline hover:no-underline"
        onClick={() => {
          window.location.href = `/connection?host=${deviceInfo?.connection?.host}&port=${
            deviceInfo?.connection?.port
          }&username=${deviceInfo?.connection?.username}&password=${
            deviceInfo?.connection?.password
          }&displayName=${deviceName}&type=${deviceInfo.type}&method=${
            deviceInfo.method
          }`
        }}>
        Connect without saving
      </span>
      <div className="space-x-2">
        <Button
          variant="secondary"
          onClick={back}>
          Back
        </Button>
        <Button
          className="text-background"
          onClick={() => handleDeviceSave(deviceName || 'Unnamed reMarkable')}>
          {editingDevice.id ? 'Save Changes' : 'Save'}
        </Button>
      </div>
    </>
  )
}

export default function NewDevice({
  existingDevices,
  developerMode,
  editingDevice,
  // handleAddOrEditDevice,
  getDevices,
  setAddDevice
}: {
  existingDevices: boolean
  developerMode: boolean
  editingDevice: DeviceInfo
  // handleAddOrEditDevice: (existingDevice: DeviceInfo) => void;
  getDevices: () => void
  setAddDevice: (addDevice: boolean) => void
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(
    editingDevice ? editingDevice : {}
  )

  // Back button
  const back = () => {
    // If we're on step 2 and the device is redockable, go back to step 0
    if (currentStep === 2 && deviceInfo.method === 'redockable') {
      setCurrentStep(0)
      return
    }

    setCurrentStep(currentStep - 1)
  }

  // Step 0: Select device type
  const handleDeviceSelect = (type: DeviceType) => {
    if (type === 'redockable') {
      setDeviceInfo(
        deviceInfo =>
          ({
            ...deviceInfo,
            type,
            method: deviceInfo.method ? deviceInfo.method : 'redockable',
            connection: {
              host: deviceInfo?.connection?.host
                ? deviceInfo?.connection?.host
                : '127.0.0.1',
              username: deviceInfo?.connection?.username
                ? deviceInfo?.connection?.username
                : 'root',
              password: deviceInfo?.connection?.password
                ? deviceInfo?.connection?.password
                : '',
              port: deviceInfo?.connection?.port
                ? deviceInfo?.connection?.port
                : 22
            }
          }) as DeviceInfo
      )
      setCurrentStep(2)
      return
    }

    setDeviceInfo({
      ...deviceInfo,
      type
    })
    setCurrentStep(1)
  }

  // Step 1: Select connection method
  const handleConnectionMethodSelect = (method: DeviceMethod) => {
    setDeviceInfo(
      deviceInfo =>
        ({
          ...deviceInfo,
          method,
          connection: {
            host: deviceInfo?.connection?.host
              ? deviceInfo?.connection?.host
              : method === 'usb'
                ? '10.11.99.1'
                : '',
            username: deviceInfo?.connection?.username
              ? deviceInfo?.connection?.username
              : 'root',
            password: deviceInfo?.connection?.password
              ? deviceInfo?.connection?.password
              : '',
            port: deviceInfo?.connection?.port
              ? deviceInfo?.connection?.port
              : 22
          }
        }) as DeviceInfo
    )
    setCurrentStep(2)
  }

  // Step 2: Configure connection details
  const handleConnectionDetailsSubmit = (connection: Connection) => {
    setDeviceInfo({
      ...deviceInfo,
      connection
    })
    setCurrentStep(3)
  }

  // Step 3a: Name and save device
  const handleDeviceSave = (displayName: string) => {
    // Save device
    const fullDeviceInfo = {
      ...deviceInfo,
      displayName
    }

    try {
      window.ipc.addDevice(fullDeviceInfo)
      getDevices() // Refresh devices
      setAddDevice(false) // Close add screen
    } catch (e) {
      console.error(e)
    }
  }

  const cancel = () => {
    setDeviceInfo({}) // Reset device info
    setAddDevice(false) // Close add
  }

  return (
    <>
      {/* <code>{JSON.stringify(deviceInfo, null, 2)}</code> */}
      {currentStep === 0 && (
        <DeviceSelector
          developerMode={developerMode}
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
          developerMode={developerMode}
          startInAdvanced={deviceInfo.method === 'redockable'}
          handleConnectionDetailsSubmit={handleConnectionDetailsSubmit}
          back={back}
        />
      )}
      {currentStep === 3 && (
        <SaveDevice
          deviceInfo={deviceInfo}
          editingDevice={editingDevice}
          handleDeviceSave={handleDeviceSave}
          back={back}
        />
      )}
    </>
  )
}
