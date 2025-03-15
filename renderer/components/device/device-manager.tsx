import React from 'react'
import type { DeviceInfo, UserSettings, HostStatus } from '../../types'
import NewDevice from './new-device'
import DeviceList from './device-list'

export default function DeviceManager({
  setHideHeader
}: {
  setHideHeader: (hideHeader: boolean) => void
}) {
  const [devices, setDevices] = React.useState<DeviceInfo[]>([])
  const [aliveHosts, setAliveHosts] = React.useState<string[]>([])
  const [addDevice, setAddDevice] = React.useState(false)
  const [userSettings, setUserSettings] = React.useState<UserSettings | null>(
    null
  )
  const [editingDevice, setEditingDevice] = React.useState<DeviceInfo | null>(
    null
  )

  const devicesRef = React.useRef(devices)

  // Ping devices when the devices list changes
  React.useEffect(() => {
    devicesRef.current = devices
    if (devices.length <= 0) {
      setHideHeader(true)
    } else {
      setHideHeader(false)
    }
    window.ipc.pingDevices(devicesRef.current)
  }, [devices])

  // Reset editing device when adding a new device
  React.useEffect(() => {
    if (!addDevice) {
      setEditingDevice({})
      setHideHeader(false)
    } else {
      setHideHeader(true)
    }
  }, [addDevice])

  // Main React.useEffect hook
  React.useEffect(() => {
    window.ipc.getUserSettings() // Get user data
    getDevices() // Get devices

    // Listen for user settings response
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      setUserSettings(settings)
    })

    // Listen for get devices response
    window.ipc.on('get-devices-res', (devices: DeviceInfo[]) => {
      setDevices(devices)
    })

    // Listen for ping devices response
    window.ipc.on('ping-devices-res', (hosts: HostStatus[]) => {
      const aliveHosts = hosts.filter(host => host.alive).map(host => host.id)
      setAliveHosts(aliveHosts)
    })

    // Ping devices every 5 seconds
    setInterval(() => {
      window.ipc.pingDevices(devicesRef.current)
    }, 5000)
  }, [])

  // Get devices
  const getDevices = () => {
    window.ipc.getDevices()
  }

  const handleDeviceAddOrEdit = (existingDeviceInfo: DeviceInfo) => {
    setEditingDevice(existingDeviceInfo)
    setAddDevice(true)
  }

  if (addDevice || devices.length <= 0) {
    return (
      <NewDevice
        editingDevice={editingDevice}
        getDevices={getDevices}
        existingDevices={devices.length > 0}
        developerMode={userSettings?.developerMode}
        setAddDevice={setAddDevice}
      />
    )
  } else {
    return (
      <DeviceList
        getDevices={getDevices}
        handleAddOrEditDevice={handleDeviceAddOrEdit}
        devices={devices}
        aliveHosts={aliveHosts}
        setAddDevice={setAddDevice}
      />
    )
  }
}
