import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import Image from 'next/image'
import { ScreenInfo } from '@/types'

export default function ScreenDialog({
  screen,
  screenPreviewOpen,
  setScreenPreviewOpen
}: {
  screen: ScreenInfo
  screenPreviewOpen: boolean
  setScreenPreviewOpen: (open: boolean) => void
}) {
  return (
    <Dialog
      open={screenPreviewOpen}
      onOpenChange={() => {
        setScreenPreviewOpen(false)
      }}>
      <DialogContent className="m-auto w-max p-0">
        <DialogTitle className="sr-only">{screen.name} dialog</DialogTitle>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 opacity-50"
          onClick={() => setScreenPreviewOpen(false)}>
          <X />
        </Button>
        <Image
          src={screen.dataUrl}
          alt={screen.name}
          width={600}
          height={800}
          className="max-h-[calc(100vh_-_8rem)] w-auto rounded-md"
        />
      </DialogContent>
    </Dialog>
  )
}
