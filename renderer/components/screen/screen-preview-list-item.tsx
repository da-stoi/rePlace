import React from 'react'
import { cn } from '@/lib/utils'
import { ScreenInfo } from '@/types'
import { Save, Download, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Image from 'next/image'
import ScreenDialog from './screen-dialog'

export function ScreenPreviewListItem({
  screen,
  editableTitle,
  showDeleteButton,
  showDownloadButton,
  interactive
}: {
  screen: ScreenInfo
  showTitle: boolean // Determines whether the title input is shown
  editableTitle: boolean // Determines whether the title input is editable
  showDeleteButton: boolean // Determines whether the delete button is shown
  showDownloadButton: boolean // Determines whether the download button is shown
  interactive: boolean // Determines whether the carousel is interactive
}) {
  const [screenName, setScreenName] = React.useState(screen.name)
  const [screenPreviewOpen, setScreenPreviewOpen] = React.useState(false)

  const removeScreen = (id: string) => {
    window.ipc.removeScreen(id)
  }

  const updateName = (name: string) => {
    window.ipc.addScreen({ ...screen, name })
  }

  const downloadScreen = (dataUrl: string, name: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-2">
      <div className="flex flex-row place-content-center gap-4">
        <div className="basis-1/4 place-self-end">
          <Image
            onClick={() => interactive && setScreenPreviewOpen(true)}
            src={screen.dataUrl}
            alt={screen.name}
            width={220}
            height={280}
            className="m-auto h-full max-h-24 w-auto cursor-pointer rounded-sm border"
          />
        </div>

        {/* Right of image */}
        <div className="flex basis-3/4 flex-col">
          {/* Title */}
          <div className="flex basis-1/2 flex-row items-center gap-2">
            <Input
              value={screenName}
              className="h-8 w-full text-sm transition-all"
              onChange={e => setScreenName(e.target.value)}
              readOnly={!editableTitle}
            />
            {editableTitle && (
              <Button
                variant="default"
                size="icon"
                className={cn(
                  'text-background h-8 w-12',
                  screenName === screen.name ? 'hidden' : ''
                )}
                onClick={() => updateName(screenName)}>
                <Save />
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex basis-1/2 flex-row items-center gap-2">
            {showDownloadButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => downloadScreen(screen.dataUrl, screen.name)}
                className={cn('transition-all delay-75')}>
                <Download /> Download
              </Button>
            )}
            {showDeleteButton && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeScreen(screen.id)}
                className={cn('transition-all delay-75')}>
                <Trash /> Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <ScreenDialog
        screen={screen}
        screenPreviewOpen={screenPreviewOpen}
        setScreenPreviewOpen={setScreenPreviewOpen}
      />
    </div>
  )
}
