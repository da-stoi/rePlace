import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  SunMedium,
  Contrast,
  Move,
  GalleryVertical,
  GalleryHorizontal,
  Save,
  XCircle
} from 'lucide-react'
import type { EditorSidebarProps } from './types'

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  image,
  userSettings,
  onCenterHorizontally,
  onCenterVertically,
  onZoomIn,
  onZoomOut,
  onFitWidth,
  onFitHeight,
  onBrightnessChange,
  onContrastChange,
  onOpacityChange,
  backgroundColor,
  onToggleBackground,
  onCancel,
  onSave
}) => {
  return (
    <div className="bg-card h-full max-h-[calc(100vh_-_10rem)] overflow-y-scroll rounded-lg p-4 duration-200">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="mb-2 flex items-center font-medium">
            <Move className="mr-2 h-4 w-4" />
            Position & Size
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onCenterHorizontally}>
              <AlignCenterHorizontal className="mr-2 h-4 w-4" />
              Center V
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onCenterVertically}>
              <AlignCenterVertical className="mr-2 h-4 w-4" />
              Center V
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onZoomIn}>
              <ZoomIn className="mr-2 h-4 w-4" />
              Zoom In
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onZoomOut}>
              <ZoomOut className="mr-2 h-4 w-4" />
              Zoom Out
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onFitWidth}>
              <GalleryHorizontal className="mr-2 h-4 w-4" />
              Fit Width
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!image.url}
              onClick={onFitHeight}>
              <GalleryVertical className="mr-2 h-4 w-4" />
              Fit Height
            </Button>
          </div>
        </div>

        <Separator className="bg-muted-foreground" />

        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness">
                <SunMedium className="mr-2 inline h-4 w-4" />
                Brightness
              </Label>
              <span>{image.brightness}%</span>
            </div>
            <div className="flex flex-row gap-2">
              <Slider
                id="brightness"
                min={0}
                max={200}
                step={1}
                value={[image.brightness]}
                disabled={!image.url}
                className="h-8"
                onValueChange={onBrightnessChange}
              />
              {image.brightness !== 100 && (
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => onBrightnessChange([100])}>
                  <RefreshCw />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">
                <Contrast className="mr-2 inline h-4 w-4" />
                Contrast
              </Label>
              <span>{image.contrast}%</span>
            </div>
            <div className="flex flex-row gap-2">
              <Slider
                id="contrast"
                min={0}
                max={200}
                step={1}
                value={[image.contrast]}
                disabled={!image.url}
                className="h-8"
                onValueChange={onContrastChange}
              />
              {image.contrast !== 100 && (
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => onContrastChange([100])}>
                  <RefreshCw />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity">
                <SunMedium className="mr-2 inline h-4 w-4" />
                Opacity
              </Label>
              <span>{image.opacity}%</span>
            </div>
            <div className="flex flex-row gap-2">
              <Slider
                id="opacity"
                min={0}
                max={100}
                step={1}
                value={[image.opacity]}
                disabled={!image.url}
                className="h-8"
                onValueChange={onOpacityChange}
              />
              {image.opacity !== 100 && (
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8"
                  onClick={() => onOpacityChange([100])}>
                  <RefreshCw />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="background-toggle">
                <SunMedium className="mr-2 inline h-4 w-4" />
                Background
              </Label>
              <Switch
                id="background-toggle"
                checked={backgroundColor === 'black'}
                onCheckedChange={onToggleBackground}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-muted-foreground" />

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            disabled={!image.url}
            onClick={onCancel}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!image.url}
            onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Screen
          </Button>
        </div>

        {userSettings?.developerMode && (
          <>
            <Separator className="bg-muted-foreground" />

            <div>
              <h3 className="mb-2 font-medium">Image Information</h3>
              {image.file ? (
                <div className="space-y-1 text-sm">
                  <p>Name: {image.file.name}</p>
                  <p>Size: {(image.file.size / 1024).toFixed(2)} KB</p>
                  <p>Type: {image.file.type}</p>
                  <p>Scale: {(image.scale * 100).toFixed(0)}%</p>
                  <p>
                    Dimensions: {Math.round(image.naturalWidth * image.scale)} ×{' '}
                    {Math.round(image.naturalHeight * image.scale)} px
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No image uploaded</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
