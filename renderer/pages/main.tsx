import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { DeviceInfo, HostStatus, ScreenInfo, UserSettings } from '../types';
import { Settings } from 'lucide-react';
import NewDevice from '../components/new-device';
import DeviceManager from '../components/device-manager';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { cn } from '../lib/utils';
import ScreenManager from '../components/screen-manager';
import DevicesTab from '../components/devices-tab';

export default function Connect() {
  const [hideTabs, setHideTabs] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(true);
  });

  return (
    <div className='mt-20'>
      <Dialog open={modalOpen}>
        <DialogContent className='p-8'>
          <Tabs
            defaultValue='devices'
            className='w-full'
          >
            <div
              className={cn('flex flex-row gap-2', hideTabs ? 'hidden' : '')}
            >
              <TabsList className='w-full filter'>
                <TabsTrigger
                  value='devices'
                  className='w-full'
                >
                  <h1>Device List</h1>
                </TabsTrigger>
                <TabsTrigger
                  value='screens'
                  className='w-full'
                >
                  <h1>Screen Manager</h1>
                </TabsTrigger>
                {/* <TabsTrigger
                  value='templates'
                  className='w-full'
                  disabled
                >
                  <h1>Template Manager</h1>
                </TabsTrigger> */}
              </TabsList>
              <Button
                variant='outline'
                className='mt-0.5'
                size='icon'
                onClick={() =>
                  (window.location.href = `/settings${
                    window.isProd ? '.html' : ''
                  }`)
                }
              >
                <Settings className='size-10' />
              </Button>
            </div>
            <TabsContent
              value='devices'
              className='flex flex-col items-center'
            >
              <DevicesTab setHideTabs={setHideTabs} />
            </TabsContent>
            <TabsContent
              value='screens'
              className='flex flex-col items-center'
            >
              <ScreenManager setHideTabs={setHideTabs} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
