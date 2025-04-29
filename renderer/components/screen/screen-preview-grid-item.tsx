import React from 'react'
import { cn } from '@/lib/utils'
import type { ScreenInfo } from '@/types'
import { Save, Download, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Image from 'next/image'
import ScreenDialog from './screen-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'

export function ScreenPreviewGridItem({
  screen,
  showTitle,
  editableTitle = false,
  showDeleteButton = false,
  showDownloadButton = false,
  interactive = false,
  titlePosition = 'bottom',
  className
}: {
  screen: ScreenInfo
  showTitle?: boolean // Determines whether the title input is shown
  editableTitle?: boolean // Determines whether the title input is editable
  showDeleteButton?: boolean // Determines whether the delete button is shown
  showDownloadButton?: boolean // Determines whether the download button is shown
  interactive?: boolean // Determines whether the carousel is interactive
  titlePosition?: 'top' | 'bottom' // Determines the position of the title input
  className?: string // Additional class names for styling
}) {
  const [hovered, setHovered] = React.useState(false)
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

  const titleBox = (
    <div className="flex flex-row gap-2">
      <Input
        value={screenName}
        className="h-8 text-center text-sm transition-all"
        readOnly={!editableTitle}
        onChange={e => setScreenName(e.target.value)}
      />
      {editableTitle && (
        <Button
          variant="default"
          size="icon"
          className={cn(
            'text-background h-8 w-10',
            screenName === screen.name ? 'hidden' : ''
          )}
          onClick={() => updateName(screenName)}>
          <Save />
        </Button>
      )}
    </div>
  )

  return (
    <div className="relative">
      <div className="absolute bottom-12 right-1/2 z-10 flex -translate-y-1/2 translate-x-1/2 gap-2">
        {showDownloadButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    'transition-all delay-75',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={() => downloadScreen(screen.dataUrl, screen.name)}>
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {showDeleteButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className={cn(
                    'transition-all delay-75',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={() => removeScreen(screen.id)}>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {showTitle && titlePosition === 'top' && titleBox}
      {/* <Tilt
        className={'h-full w-full'}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}> */}
      <Image
        src={screen.dataUrl}
        alt={screen.name}
        width={220}
        height={280}
        className={cn(
          'm-auto mb-2 h-full max-h-[calc(100vh_-_18rem)] w-auto rounded-md border',
          className
        )}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => interactive && setScreenPreviewOpen(true)}
      />
      {/* </Tilt> */}
      {showTitle && titlePosition === 'bottom' && titleBox}
      <ScreenDialog
        screen={screen}
        screenPreviewOpen={screenPreviewOpen}
        setScreenPreviewOpen={setScreenPreviewOpen}
      />
    </div>
  )
}
