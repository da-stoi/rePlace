import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, Move, Save, SunMoon, XCircle } from 'lucide-react'
import type { CreatorSidebarProps } from './types'
import { Switch } from '../ui/switch'

export const CreatorSidebar: React.FC<CreatorSidebarProps> = ({
  theme,
  faceDetails,
  linkedEyes,
  onFaceDetailChange,
  onThemeChange,
  onLinkEyesChange,
  onSave,
  onCancel
}) => {
  const updateFaceDetails = (
    key: 'leftEye' | 'rightEye' | 'mouth',
    index: 0 | 1,
    value: number
  ) => {
    const arr = [...faceDetails[key]]
    arr[index] = value
    onFaceDetailChange({ ...faceDetails, [key]: arr })
  }

  return (
    <div className="bg-card h-full max-h-[calc(100vh_-_10rem)] min-w-56 overflow-y-scroll rounded-lg p-4 duration-200">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="mb-2 flex items-center font-medium">
            <SunMoon className="mr-2 h-4 w-4" />
            Theme
          </h3>

          <div className="flex flex-row items-center gap-2">
            <Switch
              id="themeToggle"
              checked={theme === 'dark'}
              onCheckedChange={checked => {
                onThemeChange(checked ? 'dark' : 'light')
              }}
            />
            <Label htmlFor="themeToggle">Theme toggle</Label>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="mb-2 flex items-center font-medium">
            <Eye className="mr-2 h-4 w-4" />
            Eyes
          </h3>

          <div className="flex flex-row items-center gap-2">
            <Switch
              id="linkEyes"
              checked={linkedEyes}
              onCheckedChange={checked => {
                onLinkEyesChange(checked)
              }}
            />
            <Label htmlFor="linkEyes">Link Eyes</Label>
          </div>

          {/* Left Eye Sliders */}
          <div className="space-y-1">
            <Label>Left Eye Height</Label>
            <Slider
              min={-70}
              max={70}
              step={10}
              value={[faceDetails.leftEye[0]]}
              onValueChange={v => updateFaceDetails('leftEye', 0, v[0])}
            />
            <Label>Left Eye Width</Label>
            <Slider
              min={80}
              max={120}
              step={10}
              value={[faceDetails.leftEye[1]]}
              onValueChange={v => updateFaceDetails('leftEye', 1, v[0])}
            />
          </div>

          {/* Right Eye Sliders */}
          <div className="space-y-1">
            <Label>Right Eye Height</Label>
            <Slider
              min={-70}
              max={70}
              step={10}
              value={[faceDetails.rightEye[0]]}
              onValueChange={v => updateFaceDetails('rightEye', 0, v[0])}
            />
            <Label>Right Eye Width</Label>
            <Slider
              min={80}
              max={120}
              step={10}
              value={[faceDetails.rightEye[1]]}
              onValueChange={v => updateFaceDetails('rightEye', 1, v[0])}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="mb-2 flex items-center font-medium">
            <Move className="mr-2 h-4 w-4" />
            Mouth
          </h3>

          {/* Mouth Type Toggle */}
          <div className="space-y-2">
            <Label>Mouth Type</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={
                  faceDetails.mouthType === 'arch' ? 'default' : 'outline'
                }
                onClick={() =>
                  onFaceDetailChange({ ...faceDetails, mouthType: 'arch' })
                }>
                Arch
              </Button>
              <Button
                size="sm"
                variant={
                  faceDetails.mouthType === 'ellipse' ? 'default' : 'outline'
                }
                onClick={() =>
                  onFaceDetailChange({ ...faceDetails, mouthType: 'ellipse' })
                }>
                Ellipse
              </Button>
            </div>
          </div>

          {/* Mouth Size Sliders */}
          <div className="space-y-1">
            <Label>Mouth Height</Label>
            <Slider
              min={-120}
              max={120}
              step={10}
              value={[faceDetails.mouth[0]]}
              onValueChange={v => updateFaceDetails('mouth', 0, v[0])}
            />
            <Label>Mouth Width</Label>
            <Slider
              min={120}
              max={240}
              step={10}
              value={[faceDetails.mouth[1]]}
              onValueChange={v => updateFaceDetails('mouth', 1, v[0])}
            />
          </div>
        </div>

        <Separator className="bg-muted-foreground" />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={onCancel}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Screen
          </Button>
        </div>
      </div>
    </div>
  )
}
