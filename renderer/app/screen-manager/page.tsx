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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'
import { UploadEditor } from '@/components/upload-editor/upload-editor'
import { ScreenCreator } from '@/components/screen-creator/creator'

export default function ScreenManager() {
  const [gridView, setGridView] = React.useState(true)
  const [screens, setScreens] = React.useState<ScreenInfo[]>([])
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false)

  React.useEffect(() => {
    window.ipc.getScreens()

    // Listen for screens response
    window.ipc.on('get-screens-res', (screens: ScreenInfo[]) => {
      setScreens(screens)
    })
  }, [])

  const handleFileUpload = (file: File) => {
    setSelectedFile(file)
    setIsEditorOpen(true)
  }

  const handleCreateScreen = () => {
    setIsCreatorOpen(true)
  }

  const handleEditorClose = () => {
    setIsEditorOpen(false)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

      {/* Image Editor Modal */}
      {isEditorOpen && selectedFile && (
        <>
          <Dialog
            open={isEditorOpen}
            aria-label="Image Editor"
            // onOpenChange={state => (!state ? handleEditorClose() : null)}
          >
            <DialogContent className="m-auto h-min max-h-[calc(100vh_-_8rem)] min-w-[750px] p-3 lg:min-w-[900px]">
              <DialogTitle className="sr-only">Image editor</DialogTitle>
              <DialogDescription className="sr-only">
                Edit the image that was just uploaded.
              </DialogDescription>
              <UploadEditor
                imageFile={selectedFile}
                onSave={handleEditorClose}
              />
            </DialogContent>
          </Dialog>
          <div className="bg-background fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-lg border px-3 py-1 text-center text-sm">
            <p>
              Scroll to resize • Drag to position • Snap points at center and
              edges
            </p>
          </div>
        </>
      )}

      {/* Image Creator Modal */}
      <Dialog
        open={isCreatorOpen}
        aria-label="Image Creator"
        // onOpenChange={state => (!state ? handleEditorClose() : null)}
      >
        <DialogContent className="m-auto h-min max-h-[calc(100vh_-_8rem)] min-w-[750px] p-3 lg:min-w-[900px]">
          <DialogTitle className="sr-only">Image creator</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new screen.
          </DialogDescription>
          <ScreenCreator onSave={() => setIsCreatorOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
