import { Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { DeviceInfo, UserSettings, HostStatus } from '../types';
import { Button } from './ui/button';
import NewDevice from './new-device';
import DeviceManager from './device-manager';

export default function DevicesTab({
  setHideTabs,
}: {
  setHideTabs: (hideTabs: boolean) => void;
}) {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [aliveHosts, setAliveHosts] = useState<string[]>([]);
  const [addDevice, setAddDevice] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [editingDevice, setEditingDevice] = useState<DeviceInfo | null>(null);

  const devicesRef = useRef(devices);

  // Ping devices when the devices list changes
  useEffect(() => {
    devicesRef.current = devices;
    window.ipc.pingDevices(devicesRef.current);
  }, [devices]);

  // Reset editing device when adding a new device
  useEffect(() => {
    if (!addDevice) {
      setEditingDevice({});
      setHideTabs(false);
    } else {
      setHideTabs(true);
    }
  }, [addDevice]);

  // Main useEffect hook
  useEffect(() => {
    window.ipc.getUserSettings(); // Get user data
    getDevices(); // Get devices

    // Listen for user settings response
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      setUserSettings(settings);
    });

    // Listen for get devices response
    window.ipc.on('get-devices-res', (devices: DeviceInfo[]) => {
      setDevices(devices);
    });

    // Listen for ping devices response
    window.ipc.on('ping-devices-res', (hosts: HostStatus[]) => {
      const aliveHosts = hosts
        .filter((host) => host.alive)
        .map((host) => host.id);
      setAliveHosts(aliveHosts);
    });

    // Ping devices every 5 seconds
    setInterval(() => {
      window.ipc.pingDevices(devicesRef.current);
    }, 5000);
  }, []);

  // Get devices
  const getDevices = () => {
    window.ipc.getDevices();
  };

  const handleDeviceAddOrEdit = (existingDeviceInfo: DeviceInfo) => {
    setEditingDevice(existingDeviceInfo);
    setAddDevice(true);
  };

  if (addDevice || devices.length <= 0) {
    return (
      <NewDevice
        editingDevice={editingDevice}
        getDevices={getDevices}
        existingDevices={devices.length > 0}
        developerMode={userSettings?.developerMode}
        setAddDevice={setAddDevice}
      />
    );
  } else {
    return (
      <DeviceManager
        getDevices={getDevices}
        handleAddOrEditDevice={handleDeviceAddOrEdit}
        devices={devices}
        aliveHosts={aliveHosts}
        setAddDevice={setAddDevice}
      />
    );
  }
}
