import React from 'react'
import { AspectRatio } from '../ui/aspect-ratio'
import { creatorWidth, creatorHeight } from './constants'
import Screen from './templates/screen'
import type { ScreenCreatorProps } from './types'
import { cn } from '@/lib/utils'

export interface ScreenCreatorCanvasProps extends ScreenCreatorProps {
  canvasRef: React.RefObject<HTMLDivElement>
  download: boolean
}

export const CreatorCanvas = ({
  theme,
  faceDetails,
  download,
  linkedEyes,
  canvasRef
}: ScreenCreatorCanvasProps) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <AspectRatio
        ratio={creatorWidth / creatorHeight}
        className={cn(
          'relative mx-auto h-auto flex-1 overflow-hidden rounded border',
          download
            ? 'h-[936px] w-[702px] overflow-visible'
            : 'max-h-[calc(100vh_-_10rem)] w-full max-w-[calc((100vh_-_10rem)_*_0.75)] duration-200'
        )}>
        <div
          ref={canvasRef}
          className="relative h-full w-full">
          <Screen
            theme={theme}
            faceDetails={faceDetails}
            linkedEyes={linkedEyes}
          />
        </div>
      </AspectRatio>
    </div>
  )
}
