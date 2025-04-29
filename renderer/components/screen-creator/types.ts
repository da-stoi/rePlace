export interface FaceDetailProps {
  rightEye: number[] // [<height>, <width>]
  leftEye: number[] // [<height>, <width>]
  mouth: number[] // [<height>, <width>]
  mouthType: 'arch' | 'ellipse'
}

export interface ScreenCreatorProps {
  theme: 'dark' | 'light'
  faceDetails: FaceDetailProps
  linkedEyes: boolean
}

export interface CreatorSidebarProps extends ScreenCreatorProps {
  onFaceDetailChange: (updatedFaceDetail: FaceDetailProps) => void
  onThemeChange: (newTheme: 'dark' | 'light') => void
  onLinkEyesChange: (value: boolean) => void
  onSave: () => void
  onCancel: () => void
}
