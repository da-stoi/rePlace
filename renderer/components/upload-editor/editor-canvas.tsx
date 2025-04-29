import React from 'react'
import NextImage from 'next/image'
import { AspectRatio } from '../ui/aspect-ratio'
import { editorWidth, editorHeight } from './constants'
import type { EditorCanvasProps } from './types'

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  image,
  isDragging,
  isSnapping,
  editorRef,
  imageRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onWheel,
  backgroundColor
}) => {
  return (
    <div className="flex flex-1 flex-col items-center">
      <AspectRatio
        ratio={editorWidth / editorHeight}
        className="relative mx-auto h-auto max-h-[calc(100vh_-_10rem)] w-full max-w-[calc((100vh_-_10rem)_*_0.75)] flex-1 overflow-hidden rounded border bg-white duration-200"
        style={{ backgroundColor }}>
        <div
          ref={editorRef}
          className="relative h-full w-full"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onWheel={onWheel}>
          {image.url && (
            <div
              className="absolute left-0 top-0 h-full w-full transform-gpu"
              style={{
                transform: `translate(${(image.position.x * (editorRef.current?.getBoundingClientRect().width || 1)) / editorWidth}px, ${(image.position.y * (editorRef.current?.getBoundingClientRect().height || 1)) / editorHeight}px)`,
                transformOrigin: 'top left',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}>
              <NextImage
                ref={imageRef}
                width={editorWidth}
                height={editorHeight}
                src={
                  image.url ||
                  'https://danielstoiber.com/resources/project/replace/icon.png'
                }
                alt="Uploaded"
                className="max-w-none"
                draggable="false"
                style={{
                  transform: `scale(${image.scale})`,
                  transformOrigin: 'top left',
                  filter: `brightness(${image.brightness}%) contrast(${image.contrast}%)`,
                  opacity: image.opacity / 100,
                  width: `${(image.naturalWidth * (editorRef.current?.getBoundingClientRect().width || 1)) / editorWidth}px`,
                  height: `${(image.naturalHeight * (editorRef.current?.getBoundingClientRect().height || 1)) / editorHeight}px`
                }}
              />
            </div>
          )}
          {/* Snap guides */}
          {isSnapping.horizontal && (
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 border-l border-dashed border-blue-500" />
          )}
          {isSnapping.vertical && (
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 border-t border-dashed border-blue-500" />
          )}
          {/* Edge snap guides */}
          {isSnapping.edges.includes('left') && (
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 border-l-2 border-dashed border-blue-500" />
          )}
          {isSnapping.edges.includes('right') && (
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 border-r-2 border-dashed border-blue-500" />
          )}
          {isSnapping.edges.includes('top') && (
            <div className="pointer-events-none absolute left-0 right-0 top-0 border-t-2 border-dashed border-blue-500" />
          )}
          {isSnapping.edges.includes('bottom') && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 border-b-2 border-dashed border-blue-500" />
          )}
        </div>
      </AspectRatio>
    </div>
  )
}
