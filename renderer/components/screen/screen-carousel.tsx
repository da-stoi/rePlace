import React from 'react'
import type { ScreenInfo } from '../../types'
import { cn } from '../../lib/utils'
import type { CarouselApi } from '../ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../ui/carousel'
import { ScreenPreviewGridItem } from './screen-preview-grid-item'

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
              <ScreenPreviewGridItem
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
