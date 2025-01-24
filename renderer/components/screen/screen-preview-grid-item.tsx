import React from 'react'
import { cn } from '@/lib/utils'
import { ScreenInfo } from '@/types'
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
  editableTitle,
  showDeleteButton,
  showDownloadButton,
  interactive,
  titlePosition = 'bottom'
}: {
  screen: ScreenInfo
  showTitle: boolean // Determines whether the title input is shown
  editableTitle: boolean // Determines whether the title input is editable
  showDeleteButton: boolean // Determines whether the delete button is shown
  showDownloadButton: boolean // Determines whether the download button is shown
  interactive: boolean // Determines whether the carousel is interactive
  titlePosition?: 'top' | 'bottom' // Determines the position of the title input
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
        onChange={e => setScreenName(e.target.value)}
        readOnly={!editableTitle}
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
      <div className="absolute bottom-12 right-1/2 flex -translate-y-1/2 translate-x-1/2 gap-2">
        {showDownloadButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={() => downloadScreen(screen.dataUrl, screen.name)}
                  className={cn(
                    'transition-all delay-75',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}>
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
                  onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={() => removeScreen(screen.id)}
                  className={cn(
                    'transition-all delay-75',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete screen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {showTitle && titlePosition === 'top' && titleBox}
      <Image
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => interactive && setScreenPreviewOpen(true)}
        src={screen.dataUrl}
        alt={screen.name}
        width={220}
        height={280}
        className="m-auto mb-2 h-full max-h-[calc(100vh_-_18rem)] w-auto rounded-md border"
      />
      {showTitle && titlePosition === 'bottom' && titleBox}
      <ScreenDialog
        screen={screen}
        screenPreviewOpen={screenPreviewOpen}
        setScreenPreviewOpen={setScreenPreviewOpen}
      />
    </div>
  )
}
