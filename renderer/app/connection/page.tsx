'use client'

// import { React.useEffect, React.useRef, React.useState } from 'react'
import React from 'react'
import type { DeviceInfo, DeviceMethod, DeviceType, ScreenInfo } from '@/types'
import {
  CheckCircle,
  ChevronsLeftRightEllipsis,
  FolderInput,
  Loader2,
  Upload,
  X,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import PageLoader from '@/components/page-load'
import MultiStepIndicator from '@/components/connection/multi-step-indicator'
import { SelectImage } from '@/components/connection/select-screen'
import { ScreenPreviewGridItem } from '@/components/screen/screen-preview-grid-item'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

function ConnectingModal({
  connected,
  connectionFailed,
  retry,
  back
}: {
  connected: boolean
  connectionFailed: boolean
  retry: () => void
  back: () => void
}) {
  return (
    <Dialog open={!connected || connectionFailed}>
      <DialogContent className="flex flex-col items-center p-10">
        {connectionFailed ? (
          <>
            <DialogTitle className="flex flex-row gap-2 text-3xl font-bold">
              <XCircle className="m-auto size-8" />
              Connection Failed
            </DialogTitle>
            <p className="text-center text-lg">
              Failed to connect to your device. Please check that your device is
              on and not on the sleep screen and that your device IP address has
              not changed.
            </p>
            <div className="mt-6 flex w-full flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={back}>
                Back
              </Button>
              <Button
                variant="default"
                size="lg"
                className="text-background w-full"
                onClick={retry}>
                Retry
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="flex flex-row gap-2 text-3xl font-bold">
              <ChevronsLeftRightEllipsis className="m-auto size-8" />
              Connecting
            </DialogTitle>
            <div className="flex items-center justify-center">
              <Loader2 className="size-12 animate-spin" />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="mt-6 w-full"
              onClick={back}>
              Cancel
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function Connection() {
  const [connectionFailed, setConnectionFailed] = React.useState<boolean>(false)
  const [lastHeartbeat, setLastHeartbeat] = React.useState<number>(0)
  const [heartbeatInterval, setHeartbeatInterval] =
    React.useState<NodeJS.Timeout | null>()
  const [retryCount, setRetryCount] = React.useState<number>(0)
  const [connected, setConnected] = React.useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo | null>(null)
  const [savedScreens, setSavedScreens] = React.useState<ScreenInfo[]>([])
  const [remoteScreens, setRemoteScreens] = React.useState<ScreenInfo[]>([])
  const [selectedSavedScreen, setSelectedSavedScreen] =
    React.useState<ScreenInfo | null>(null)
  const [selectedRemoteScreen, setSelectedRemoteScreen] =
    React.useState<ScreenInfo | null>(null)
  const [showUploadModal, setShowUploadModal] = React.useState<boolean>(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [successModalOpen, setSuccessModalOpen] = React.useState<boolean>(false)

  const heartbeatIntervalRef = React.useRef(heartbeatInterval)
  const connectionFailedRef = React.useRef(connectionFailed)
  const retryCountRef = React.useRef(retryCount)
  const connectedRef = React.useRef(connected)
  const lastHeartbeatRef = React.useRef(lastHeartbeat)

  React.useEffect(() => {
    heartbeatIntervalRef.current = heartbeatInterval
    connectionFailedRef.current = connectionFailed
    retryCountRef.current = retryCount
    connectedRef.current = connected
    lastHeartbeatRef.current = lastHeartbeat
  }, [
    lastHeartbeat,
    connected,
    retryCount,
    connectionFailed,
    heartbeatInterval
  ])

  React.useEffect(() => {
    // Get query params
    const urlParams = new URLSearchParams(window.location.search)
    const displayName = urlParams.get('displayName')
    const type = urlParams.get('type') as DeviceType
    const method = urlParams.get('method') as DeviceMethod
    const host = urlParams.get('host')
    const port = parseInt(urlParams.get('port'))
    const username = urlParams.get('username')
    const password = urlParams.get('password')

    if (!host || !username || !password || !port) {
      window.location.href = `./main`
      return
    }

    // Get saved screens
    window.ipc.getScreens()
    window.ipc.on('get-screens-res', (screens: ScreenInfo[]) => {
      setSavedScreens(screens)
    })

    // Start ipc event listeners
    window.ipc.on('connect-device-res', (res: { connected: boolean }) => {
      setConnected(res.connected)
      setRetryCount(0)
      setLastHeartbeat(Date.now())

      // If connection failed, set connection failed state
      if (!res.connected) {
        setConnectionFailed(true)
      }
    })

    window.ipc.on('check-device-res', (res: { connected: boolean }) => {
      setLastHeartbeat(Date.now())
      if (res.connected !== connectedRef.current) {
        if (res.connected) {
          setRetryCount(0)
        }
        setConnected(res.connected)
      }
    })

    window.ipc.on('get-files-res', (res: ScreenInfo[]) => {
      setRemoteScreens(res)
    })

    setDeviceInfo({
      connection: {
        host,
        port,
        username,
        password
      },
      displayName,
      type,
      method
    })
  }, [])

  // Check connection every 5 seconds
  React.useEffect(() => {
    getFiles()

    const interval = setInterval(() => {
      checkConnection()
    }, 5000)

    setHeartbeatInterval(interval)

    return () => {
      clearInterval(interval)
    }
  }, [connected])

  // Clear heartbeat interval on unmount
  React.useEffect(() => {
    if (connectionFailed) {
      clearInterval(heartbeatIntervalRef.current)
    }
  }, [connectionFailed])

  const checkConnection = () => {
    if (connectionFailedRef.current) {
      return
    }

    if (connectedRef.current && Date.now() - lastHeartbeatRef.current > 10000) {
      setConnected(false)
      return
    }

    if (!connectedRef.current && retryCountRef.current >= 3) {
      setConnectionFailed(true)
      return
    }

    if (!connectedRef.current) {
      setRetryCount(retryCountRef.current + 1)
    }

    // Check if device is connected
    window.ipc.checkDevice()
  }

  const connectDevice = () => {
    if (!deviceInfo) {
      return
    }

    // Connect to device
    window.ipc.connectDevice(deviceInfo.connection)
  }

  const disconnectDevice = () => {
    window.ipc?.disconnectDevice()
    window.location.href = `../main`
  }

  const getFiles = () => {
    console.log('getfile', deviceInfo)
    if (!deviceInfo) {
      return
    }

    window.ipc.getFiles(deviceInfo.connection)
  }

  const uploadScreen = () => {
    if (!deviceInfo || !selectedSavedScreen || !selectedRemoteScreen) {
      return
    }

    window.ipc.uploadFile({
      connection: deviceInfo.connection,
      screen: selectedRemoteScreen.name.split('.png')[0],
      file: selectedSavedScreen.dataUrl
    })

    setShowUploadModal(false)
    setSuccessModalOpen(true)
    setCurrentStep(0)
  }

  React.useEffect(() => {
    // Connect to device
    connectDevice()
  }, [deviceInfo])

  if (!deviceInfo) {
    return <PageLoader />
  }

  return (
    <div className="mt-20">
      <div className="fixed right-0 top-0 mr-10 flex w-max flex-row pl-10 pt-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="destructive"
                onClick={disconnectDevice}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Disconnect</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="fixed bottom-0 right-0 mr-5 flex w-max flex-row pb-5">
        <Button
          variant="outline"
          className="cursor-default">
          <div
            className={cn(
              'm-auto size-2.5 rounded-full',
              connected
                ? 'bg-green-700 dark:bg-green-600'
                : 'bg-amber-700 dark:bg-amber-600'
            )}
          />

          <h3 className="text-foreground m-auto">
            {deviceInfo.displayName || 'reMarkable'}
          </h3>
        </Button>
      </div>
      <div className="w-content fixed left-1/2 z-10 mb-10 -translate-x-1/2">
        <div
          className={cn(
            'bg-card flex flex-col items-center gap-3 rounded-xl px-5',
            currentStep > 0 ? 'pb-2 pt-3' : 'pb-4 pt-6'
          )}>
          <div className="flex flex-row items-center gap-2">
            <MultiStepIndicator
              showStepNumbers
              className="w-[calc(100vw_-_15rem)]"
              totalSteps={3}
              currentStep={currentStep + 1}
              endpointSize="large"
            />
            {currentStep > 0 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setCurrentStep(prev => prev - 1)
                }}>
                Back
              </Button>
            )}
          </div>
          <div className="">
            <h1 className="mb-0 text-center text-xl font-bold">
              {currentStep === 0
                ? 'Select a screen to rePlace'
                : currentStep === 1
                  ? 'Select a new screen'
                  : 'Upload screen'}
            </h1>
            <p className="text-muted-foreground mt-0 text-center text-sm">
              {currentStep === 0
                ? 'Select a screen from your device to replace.'
                : currentStep === 1
                  ? 'Select a new screen from your collection to replace the screen your just selected.'
                  : 'Upload the new screen to your device'}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-[calc(100vw_-_15rem)] pt-32">
        {/* Current step */}
        {currentStep === 0 && (
          <SelectImage
            currentScreens={remoteScreens}
            selectedScreen={selectedRemoteScreen}
            selectScreen={remoteScreen => {
              setSelectedRemoteScreen(remoteScreen)
              setCurrentStep(prev => prev + 1)
            }}
          />
        )}
        {currentStep === 1 && (
          <SelectImage
            currentScreens={savedScreens}
            selectedScreen={selectedSavedScreen}
            selectScreen={remoteScreen => {
              setSelectedSavedScreen(remoteScreen)
              setCurrentStep(prev => prev + 1)
            }}
          />
        )}
        {currentStep === 2 && (
          <div>
            <div className="mx-auto flex flex-row items-center justify-center">
              <div>
                <h1 className="text-center text-2xl">Current Screen</h1>
                <ScreenPreviewGridItem
                  screen={selectedRemoteScreen}
                  className="m-2 max-w-64"
                />
              </div>
              <div>
                <h1 className="text-center text-2xl">New Screen</h1>
                <ScreenPreviewGridItem
                  screen={selectedSavedScreen}
                  className="m-2 max-w-64"
                />
              </div>
            </div>
            {/* Upload button */}
            <Button
              className="text-background fixed bottom-5 left-1/2 -translate-x-1/2"
              disabled={
                !connected ||
                connectionFailed ||
                !selectedSavedScreen ||
                !selectedRemoteScreen
              }
              onClick={() => setShowUploadModal(true)}>
              <FolderInput /> Update Screen
            </Button>
          </div>
        )}
      </div>

      {/* Confirm upload modal */}
      <Dialog
        open={showUploadModal}
        onOpenChange={open => setShowUploadModal(open)}>
        <DialogContent className="flex flex-col items-center p-10">
          <DialogTitle className="flex flex-row gap-2 text-3xl font-bold">
            <Upload className="m-auto size-8" />
            Update Screen
          </DialogTitle>
          <p className="text-center text-lg">
            Are you sure you want to upload a screen to your device? This will
            overwrite the current screen on your device. Make sure to back up
            your current screen if you want to keep it.
          </p>
          <div className="mt-6 flex w-full flex-row gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={uploadScreen}>
              Update Screen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <Dialog
        open={successModalOpen}
        onOpenChange={open => {
          setSuccessModalOpen(open)
          if (open) {
            setTimeout(() => {
              setSuccessModalOpen(false)
              disconnectDevice()
            }, 2000)
          }
        }}>
        <DialogContent className="flex flex-col items-center p-10">
          <DialogTitle className="flex flex-row gap-2 text-3xl font-bold">
            <CheckCircle className="m-auto size-8" />
            Screen Updated
          </DialogTitle>
          <p className="text-center text-lg">Screen updated successfully!</p>
          <div className="mt-6 flex w-full flex-row gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => disconnectDevice()}>
              Disconnect
            </Button>
            <Button
              className="w-full"
              onClick={() => setSuccessModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connecting modal */}
      <ConnectingModal
        connected={connected}
        connectionFailed={connectionFailed}
        retry={() => {
          setConnectionFailed(false)
          setRetryCount(0)
          connectDevice()
        }}
        back={disconnectDevice}
      />
    </div>
  )
}
