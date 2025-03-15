import React from 'react'
import { Brush, Upload } from 'lucide-react'
import type { ScreenInfo } from '../../types'
import { Button } from '../ui/button'
import { ScreenCarousel } from './screen-carousel'

export default function ScreenManager() {
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
    <>
      {/* <h1 className='text-2xl text-center'>Screen Manager</h1> */}

      <ScreenCarousel screens={screens} />
      <div className="flex w-full flex-row gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}>
          <Upload /> Upload Screen
        </Button>
        <Button
          disabled
          variant="default"
          className="text-background w-full"
          onClick={() => handleCreateScreen()}>
          <Brush /> Create Screen
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileUpload(file)
            }
          }}
        />
      </div>
    </>
  )
}
