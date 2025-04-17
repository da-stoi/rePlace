import type { UserSettings } from '@/types'

export interface ImageState {
  file: File | null
  url: string
  position: { x: number; y: number }
  scale: number
  brightness: number
  contrast: number
  opacity: number
  naturalWidth: number
  naturalHeight: number
}

export interface SnappingState {
  horizontal: boolean
  vertical: boolean
  edges: string[] // e.g., "left", "right", "top", "bottom"
}

export interface UploadEditorProps {
  imageFile: File | null
  onSave: () => void
}

// Props for the editor canvas (left area)
export interface EditorCanvasProps {
  image: ImageState
  isDragging: boolean
  isSnapping: SnappingState
  editorRef: React.RefObject<HTMLDivElement>
  imageRef: React.RefObject<HTMLImageElement>
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void
  backgroundColor: string
}

// Props for the sidebar controls (right area)
export interface EditorSidebarProps {
  image: ImageState
  userSettings?: UserSettings
  onCenterHorizontally: () => void
  onCenterVertically: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitWidth: () => void
  onFitHeight: () => void
  onBrightnessChange: (value: number[]) => void
  onContrastChange: (value: number[]) => void
  onOpacityChange: (value: number[]) => void
  backgroundColor: string
  onToggleBackground: () => void
  onCancel: () => void
  onSave: () => void
}
