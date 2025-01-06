import React from 'react'
import { ScreenInfo } from '../types'
import Image from 'next/image'
import { Button } from './ui/button'
import { Download, Save, Trash, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Input } from './ui/input'
import { Dialog, DialogContent } from './ui/dialog'
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from './ui/carousel'

// Component to preview a screen
function ScreenPreview({
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
    <div className="mx-3 flex flex-row gap-2">
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
    <div className="relative p-2">
      <div className="absolute bottom-12 right-1/2 flex -translate-y-1/2 translate-x-1/2 gap-2">
        {showDownloadButton && (
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
        )}
        {showDeleteButton && (
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
        className="m-auto my-2 h-full max-h-[calc(100vh_-_18rem)] w-auto rounded-md border"
      />
      {showTitle && titlePosition === 'bottom' && titleBox}
      <Dialog
        open={screenPreviewOpen}
        onOpenChange={() => {
          setScreenPreviewOpen(false)
        }}>
        <DialogContent className="m-auto w-max p-0">
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
    </div>
  )
}

// Component to display a carousel of screens
export function ScreenCarousel({
  screens,
  className,
  currentIndex,
  showTitle = true,
  interactive = true,
  editableTitle = true,
  showDeleteButton = true,
  showDownloadButton = true,
  showScreenCountBar = true,
  titlePosition = 'bottom',
  onSelect
}: {
  screens: ScreenInfo[] // Array of screens to display
  className?: string
  currentIndex?: number // Index of the screen to display
  showTitle?: boolean // Determines whether the title input is shown
  interactive?: boolean // Determines whether the carousel is interactive
  editableTitle?: boolean // Determines whether the title input is editable
  showDeleteButton?: boolean // Determines whether the delete button is shown
  showDownloadButton?: boolean // Determines whether the download button is shown
  showScreenCountBar?: boolean // Determines whether the screen count bar is shown
  titlePosition?: 'top' | 'bottom' // Determines the position of the title input
  onSelect?: (screen: ScreenInfo) => void // Callback function to pass the current ScreenInfo to the parent component
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [init, setInit] = React.useState(false)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const updateCurrent = () => {
      const index = api.selectedScrollSnap()
      setCurrent(index)
      if (onSelect && screens[index]) {
        onSelect(screens[index])
      }
    }

    if (!init) {
      setInit(true)
      updateCurrent()
    }

    api.on('select', updateCurrent)
  }, [api, screens, onSelect])

  // Scroll to the currentIndex when it changes
  React.useEffect(() => {
    if (api && typeof currentIndex === 'number') {
      api.scrollTo(currentIndex)
    }
  }, [api, currentIndex])

  if (screens.length === 0) {
    return (
      <div className={cn('my-10 text-center', className)}>
        <h3 className="text-xl">No saved screens</h3>
        <p className="text-muted-foreground">
          To get started, upload or create a screen.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('max-w-64 select-none', className)}>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {screens.map((screen, index) => (
            <CarouselItem
              key={index}
              className="text-center">
              <ScreenPreview
                screen={screen}
                showTitle={showTitle}
                editableTitle={editableTitle}
                showDeleteButton={showDeleteButton}
                showDownloadButton={showDownloadButton}
                interactive={interactive}
                titlePosition={titlePosition}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {showScreenCountBar && (
        <div className="text-muted-foreground py-2 text-center text-sm">
          Saved screen {current + 1} of {screens.length}
        </div>
      )}
    </div>
  )
}
