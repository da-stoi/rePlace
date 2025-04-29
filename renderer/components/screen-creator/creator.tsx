'use client'

import { CreatorSidebar } from './creator-sidebar'
import { CreatorCanvas } from './creator-canvas'
import React from 'react'
import type { FaceDetailProps } from './types'
import { toPng } from 'html-to-image'
import type { ScreenInfo } from '@/types'

export function ScreenCreator({ onSave }: { onSave: () => void }) {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('light')
  const [faceDetails, setFaceDetails] = React.useState<FaceDetailProps>({
    rightEye: [-20, 100],
    leftEye: [-20, 100],
    mouth: [50, 200],
    mouthType: 'arch'
  })
  const [download, setDownload] = React.useState(false)
  const [linkEyes, setLinkEyes] = React.useState(true)
  const canvasRef = React.useRef<HTMLDivElement>(null)

  const handleFaceDetailChange = (updatedFaceDetail: FaceDetailProps) => {
    // If linkEyes is true, check which eye changes and update the other to reflect the same value
    if (linkEyes) {
      if (updatedFaceDetail.leftEye !== faceDetails.leftEye) {
        updatedFaceDetail.rightEye = updatedFaceDetail.leftEye
      } else if (updatedFaceDetail.rightEye !== faceDetails.rightEye) {
        updatedFaceDetail.leftEye = updatedFaceDetail.rightEye
      }
    }

    setFaceDetails(updatedFaceDetail)
  }
  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
  }
  const handleLinkEyesChange = (value: boolean) => {
    if (value) {
      setFaceDetails({
        ...faceDetails,
        leftEye: faceDetails.rightEye
      })
      setLinkEyes(true)
    } else {
      setLinkEyes(false)
    }
  }
  const handleSave = async () => {
    setDownload(true)

    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, 50)
    })

    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true })

      const screenInfo: ScreenInfo = {
        id: Date.now().toString(),
        addDate: new Date(),
        name: `Screen ${Date.now()}`,
        dataUrl
      }

      // Add screen to saved screens
      window.ipc.addScreen(screenInfo)
    } catch (error) {
      console.error('Error generating image:', error)
      setDownload(false)
    }

    setDownload(false)
    onSave()
  }

  return (
    <div className="flex h-full flex-row gap-3">
      <CreatorCanvas
        canvasRef={canvasRef}
        theme={theme}
        faceDetails={faceDetails}
        download={download}
        linkedEyes={linkEyes}
      />
      <CreatorSidebar
        theme={theme}
        faceDetails={faceDetails}
        linkedEyes={linkEyes}
        onFaceDetailChange={handleFaceDetailChange}
        onThemeChange={handleThemeChange}
        onLinkEyesChange={handleLinkEyesChange}
        onSave={() => {
          void handleSave()
        }}
        onCancel={onSave}
      />
    </div>
  )
}
