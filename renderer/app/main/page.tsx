'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import DeviceManager from '@/components/device/device-manager'
import SettingsDropdown from '@/components/misc/settings-dropdown'

export default function Connect() {
  const [hideHeader, setHideHeader] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)

  React.useEffect(() => {
    setModalOpen(true)
  }, [])

  return (
    <div className="mt-20">
      <Dialog open={modalOpen}>
        <DialogContent className="p-8">
          {/* Header */}
          <div className={cn(hideHeader ? 'hidden' : '')}>
            <DialogTitle
              className={cn(
                'text-center text-2xl',
                hideHeader ? 'hidden' : ''
              )}>
              My Devices
            </DialogTitle>

            {/* Settings */}
            <SettingsDropdown className={hideHeader ? 'hidden' : ''} />
          </div>

          {/* Main Content */}
          <DeviceManager setHideHeader={setHideHeader} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
