'use client'
import { ScreenPreviewGridItem } from '@/components/screen/screen-preview-grid-item'
import { ScreenPreviewListItem } from '@/components/screen/screen-preview-list-item'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { ScreenInfo } from '@/types'
import {
  BookImage,
  Brush,
  ChevronLeft,
  LayoutGrid,
  LayoutList,
  Upload
} from 'lucide-react'
import React from 'react'

export default function ScreenManager() {
  const [gridView, setGridView] = React.useState(true)
  const [screens, setScreens] = React.useState<ScreenInfo[]>([])
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    window.ipc.getScreens()

    // Listen for screens response
    window.ipc.on('get-screens-res', (screens: ScreenInfo[]) => {
      setScreens(screens)
    })
  }, [])

  const handleFileUpload = async (file: File) => {
    const imageDimensions = await getImageDimensions(file)

    if (imageDimensions.width !== 1404 || imageDimensions.height !== 1872) {
      alert('reMarkable screens must be exactly 1404x1872.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const screenInfo: ScreenInfo = {
        id: Date.now().toString(),
        addDate: new Date(),
        name: file.name,
        dataUrl
      }

      // Add screen to saved screens
      window.ipc.addScreen(screenInfo)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  const getImageDimensions = (file: File) => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handleCreateScreen = () => {
    console.log('Create screen')
  }

  return (
    <div className="my-14 block w-full">
      <div className="m-auto max-w-4xl px-10">
        {/* Header */}
        <div className="bg-background sticky top-14 z-50">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <BookImage className="m-auto mr-3 size-8" />
              <h1
                className="my-5 text-3xl"
                id="screen-manager">
                Screen Manager
              </h1>
            </div>
            <Button
              variant="default"
              className="my-auto"
              onClick={() => {
                window.location.href = `/main`
              }}>
              <ChevronLeft /> <h3>Back</h3>
            </Button>
          </div>
          <Separator />
        </div>

        {/* Action bar */}
        <div className="m-2 flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            {/* Upload screen */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}>
              <Upload />
              Upload screen
            </Button>

            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png"
              className="hidden"
              onChange={e => {
                handleFileUpload(e.target.files?.[0])
              }}
            />

            {/* Create screen */}
            <Button
              disabled
              variant="default"
              size="sm"
              onClick={handleCreateScreen}>
              <Brush />
              Create screen
            </Button>
          </div>

          {/* Change view */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setGridView(!gridView)}>
                  {gridView ? <LayoutList /> : <LayoutGrid />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {gridView ? 'Switch to list view' : 'Switch to grid view'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {gridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {screens.map(screen => (
              <div
                key={screen.id}
                className="m-2 max-w-64">
                <ScreenPreviewGridItem
                  showTitle
                  showDownloadButton
                  showDeleteButton
                  editableTitle
                  interactive
                  screen={screen}
                  titlePosition="bottom"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {screens.map((screen, i) => (
              <div
                key={screen.id}
                className="m-auto max-w-lg">
                {i !== 0 && <Separator />}
                <ScreenPreviewListItem
                  showTitle
                  showDownloadButton
                  showDeleteButton
                  editableTitle
                  interactive
                  screen={screen}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
