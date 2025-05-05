import type { ScreenInfo } from '@/types'
import { ScreenPreviewGridItem } from '../screen/screen-preview-grid-item'

interface SelectOldImageProps {
  currentScreens: ScreenInfo[]
  selectedScreen?: ScreenInfo
  selectScreen: (image: ScreenInfo) => void
}

export function SelectImage({
  currentScreens,
  selectScreen
}: SelectOldImageProps) {
  return (
    <div className="flex flex-wrap justify-center">
      {currentScreens.map(screen => (
        <div
          key={screen.id}
          className="m-2 max-w-48"
          onClick={() => selectScreen(screen)}>
          <ScreenPreviewGridItem
            showTitle
            // showDownloadButton
            // showDeleteButton
            // editableTitle
            // interactive
            screen={screen}
            titlePosition="bottom"
          />
        </div>
      ))}
    </div>
  )
}
