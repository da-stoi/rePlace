'use client'

import type React from 'react'
import { useRef, useState, useEffect } from 'react'

import type { ScreenInfo } from '@/types'
import { EditorSidebar } from './editor-sidebar'
import { EditorCanvas } from './editor-canvas'

const editorWidth = 1404
const editorHeight = 1872
const snapThreshold = 10 // pixels distance for snapping

interface ImageState {
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

interface SnappingState {
  horizontal: boolean
  vertical: boolean
  edges: string[] // Can contain multiple edges: "left", "right", "top", "bottom"
}

interface UploadEditorProps {
  imageFile: File | null
  onSave: () => void
}

export function UploadEditor({ imageFile, onSave }: UploadEditorProps) {
  // State for image being edited
  const [image, setImage] = useState<ImageState>({
    file: null,
    url: '',
    position: { x: 0, y: 0 },
    scale: 1,
    brightness: 100,
    contrast: 100,
    opacity: 100,
    naturalWidth: 0,
    naturalHeight: 0
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isSnapping, setIsSnapping] = useState<SnappingState>({
    horizontal: false,
    vertical: false,
    edges: []
  })
  // const [userSettings, setUserSettings] = useState<UserSettings>()
  const [backgroundColor, setBackgroundColor] = useState('white')
  const editorRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get the center point of an image
  const centerImage = (
    naturalWidth: number,
    naturalHeight: number,
    scale = 1
  ) => {
    // Always use the intended dimensions for calculations
    const editorCenterX = editorWidth / 2
    const editorCenterY = editorHeight / 2

    // Calculate scaled image dimensions
    const scaledWidth = naturalWidth * scale
    const scaledHeight = naturalHeight * scale

    // Calculate position to center the image in the virtual 1404×1872 space
    return {
      x: editorCenterX - scaledWidth / 2,
      y: editorCenterY - scaledHeight / 2
    }
  }

  // // Get user settings
  // useEffect(() => {
  //   window.ipc.getUserSettings() // Get user data

  //   // Listen for user settings response
  //   window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
  //     setUserSettings(settings)
  //   })
  // }, [])

  // Update the image when the imageFile prop is updated
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)

      // Create a temporary image to get natural dimensions
      const img = new Image()
      img.onload = () => {
        // Calculate initial scale to fit the image within the editor
        let initialScale = 1.0

        // If the image is larger than the editor in either dimension, scale it down to fit
        if (
          img.naturalWidth > editorWidth ||
          img.naturalHeight > editorHeight
        ) {
          const widthRatio = editorWidth / img.naturalWidth
          const heightRatio = editorHeight / img.naturalHeight
          initialScale = Math.min(widthRatio, heightRatio)
        }

        // Center the image on upload
        const centeredPosition = centerImage(
          img.naturalWidth,
          img.naturalHeight,
          initialScale
        )

        setImage({
          file: imageFile,
          url,
          position: centeredPosition,
          scale: initialScale,
          brightness: 100,
          contrast: 100,
          opacity: 100,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        })
      }
      img.src = url
    }
  }, [imageFile])

  // Update the image scale and position when the window/editor dimensions change
  useEffect(() => {
    const handleResize = () => {
      if (image.url && editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect()
        const scaleRatioX = editorRect.width / editorWidth
        const scaleRatioY = editorRect.height / editorHeight

        const newScale = Math.min(scaleRatioX, scaleRatioY)
        const centeredPosition = centerImage(
          image.naturalWidth,
          image.naturalHeight,
          newScale
        )

        setImage(prevImage => ({
          ...prevImage,
          scale: newScale,
          position: centeredPosition
        }))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [image.url, image.naturalWidth, image.naturalHeight])

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!image.url || !editorRef.current) return

    // Store the initial mouse position and the current image position
    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY
    })
  }

  // Handle drag move
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !editorRef.current || !image.url) return

    const editorRect = editorRef.current.getBoundingClientRect()

    // Calculate the scale ratio between the rendered editor and the intended dimensions
    const scaleRatioX = editorRect.width / editorWidth
    const scaleRatioY = editorRect.height / editorHeight

    // // Convert mouse position to the virtual 1404×1872 coordinate space
    // const virtualMouseX = (e.clientX - editorRect.left) / scaleRatioX
    // const virtualMouseY = (e.clientY - editorRect.top) / scaleRatioY

    // Calculate new position in the virtual space
    const deltaX = (e.clientX - dragStart.x) / scaleRatioX
    const deltaY = (e.clientY - dragStart.y) / scaleRatioY
    let newX = image.position.x + deltaX
    let newY = image.position.y + deltaY

    // Update dragStart for the next move event
    setDragStart({
      x: e.clientX,
      y: e.clientY
    })

    // Calculate center points in the virtual space
    const editorCenterX = editorWidth / 2
    const editorCenterY = editorHeight / 2

    // Calculate scaled image dimensions
    const scaledWidth = image.naturalWidth * image.scale
    const scaledHeight = image.naturalHeight * image.scale

    // Calculate image center points
    const imageCenterX = scaledWidth / 2
    const imageCenterY = scaledHeight / 2

    // Check for horizontal center snap
    const horizontalCenterDiff = Math.abs(newX + imageCenterX - editorCenterX)
    const isNearHorizontalCenter = horizontalCenterDiff < snapThreshold

    // Check for vertical center snap
    const verticalCenterDiff = Math.abs(newY + imageCenterY - editorCenterY)
    const isNearVerticalCenter = verticalCenterDiff < snapThreshold

    // Track which edges are snapping
    const snappingEdges: string[] = []

    // Left edge
    if (Math.abs(newX) < snapThreshold) {
      newX = 0
      snappingEdges.push('left')
    }

    // Right edge
    const rightEdgePos = editorWidth - scaledWidth
    if (Math.abs(newX - rightEdgePos) < snapThreshold) {
      newX = rightEdgePos
      snappingEdges.push('right')
    }

    // Top edge
    if (Math.abs(newY) < snapThreshold) {
      newY = 0
      snappingEdges.push('top')
    }

    // Bottom edge
    const bottomEdgePos = editorHeight - scaledHeight
    if (Math.abs(newY - bottomEdgePos) < snapThreshold) {
      newY = bottomEdgePos
      snappingEdges.push('bottom')
    }

    // Apply horizontal center snap
    if (isNearHorizontalCenter) {
      newX = editorCenterX - imageCenterX
    }

    // Apply vertical center snap
    if (isNearVerticalCenter) {
      newY = editorCenterY - imageCenterY
    }

    // Update snapping state for visual indicators
    setIsSnapping({
      horizontal: isNearHorizontalCenter,
      vertical: isNearVerticalCenter,
      edges: snappingEdges
    })

    setImage({
      ...image,
      position: {
        x: newX,
        y: newY
      }
    })
  }

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
    setIsSnapping({
      horizontal: false,
      vertical: false,
      edges: []
    })
  }

  // Handle scroll zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (!image.url || !editorRef.current) return

    // Determine scale change based on wheel direction
    const scaleChange = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.1, Math.min(5, image.scale + scaleChange))

    // Calculate current center position of the image in the virtual space
    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2

    // Calculate new dimensions after scaling
    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale

    // Calculate new position to keep the center point the same
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2

    setImage({
      ...image,
      scale: newScale,
      position: {
        x: newX,
        y: newY
      }
    })
  }

  // Center vertically
  const handleCenterVertically = () => {
    if (!image.url) return

    const editorCenterX = editorWidth / 2
    const scaledWidth = image.naturalWidth * image.scale
    const imageCenterX = scaledWidth / 2

    setImage({
      ...image,
      position: {
        ...image.position,
        x: editorCenterX - imageCenterX
      }
    })
  }

  // Center vertically
  const handleCenterHorizontally = () => {
    if (!image.url) return

    const editorCenterY = editorHeight / 2
    const scaledHeight = image.naturalHeight * image.scale
    const imageCenterY = scaledHeight / 2

    setImage({
      ...image,
      position: {
        ...image.position,
        y: editorCenterY - imageCenterY
      }
    })
  }

  const handleFitWidth = () => {
    if (!image.url) return

    // Calculate scale to fit width
    const newScale = editorWidth / image.naturalWidth

    // Calculate new height after scaling
    const newScaledHeight = image.naturalHeight * newScale

    // Center vertically
    const editorCenterY = editorHeight / 2
    const imageCenterY = newScaledHeight / 2

    setImage({
      ...image,
      scale: newScale,
      position: {
        x: 0, // Left align
        y: editorCenterY - imageCenterY // Center vertically
      }
    })
  }

  const handleFitHeight = () => {
    if (!image.url) return

    // Calculate scale to fit height
    const newScale = editorHeight / image.naturalHeight

    // Calculate new width after scaling
    const newScaledWidth = image.naturalWidth * newScale

    // Center horizontally
    const editorCenterX = editorWidth / 2
    const imageCenterX = newScaledWidth / 2

    setImage({
      ...image,
      scale: newScale,
      position: {
        x: editorCenterX - imageCenterX, // Center horizontally
        y: 0 // Top align
      }
    })
  }

  // Handle zoom in
  const handleZoomIn = () => {
    if (!image.url || !editorRef.current) return

    const newScale = Math.min(5, image.scale + 0.1)

    // Calculate current center position of the image
    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2

    // Calculate new dimensions after scaling
    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale

    // Calculate new position to keep the center point the same
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2

    setImage({
      ...image,
      scale: newScale,
      position: {
        x: newX,
        y: newY
      }
    })
  }

  // Handle zoom out
  const handleZoomOut = () => {
    if (!image.url || !editorRef.current) return

    const newScale = Math.max(0.1, image.scale - 0.1)

    // Calculate current center position of the image
    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2

    // Calculate new dimensions after scaling
    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale

    // Calculate new position to keep the center point the same
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2

    setImage({
      ...image,
      scale: newScale,
      position: {
        x: newX,
        y: newY
      }
    })
  }

  // Handle brightness change
  const handleBrightnessChange = (value: number[]) => {
    setImage({
      ...image,
      brightness: value[0]
    })
  }

  // Handle contrast change
  const handleContrastChange = (value: number[]) => {
    setImage({
      ...image,
      contrast: value[0]
    })
  }

  // Handle opacity change
  const handleOpacityChange = (value: number[]) => {
    setImage({
      ...image,
      opacity: value[0]
    })
  }

  // Toggle background color
  const toggleBackgroundColor = () => {
    setBackgroundColor(prevColor => (prevColor === 'white' ? 'black' : 'white'))
  }

  // Handle save screen
  const handleSaveScreen = () => {
    if (!image.file) return

    const canvas = document.createElement('canvas')
    canvas.width = editorWidth
    canvas.height = editorHeight
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set background color
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw the image with transformations
    const img = new Image()
    img.src = image.url
    img.onload = () => {
      ctx.filter = `brightness(${image.brightness}%) contrast(${image.contrast}%)`
      ctx.globalAlpha = image.opacity / 100
      ctx.drawImage(
        img,
        image.position.x,
        image.position.y,
        image.naturalWidth * image.scale,
        image.naturalHeight * image.scale
      )

      const dataUrl = canvas.toDataURL('image/png')
      const screenInfo: ScreenInfo = {
        id: Date.now().toString(),
        addDate: new Date(),
        name: image.file.name,
        dataUrl
      }

      // Add screen to saved screens
      window.ipc.addScreen(screenInfo)

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onSave()
    }
  }

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (image.url) {
        URL.revokeObjectURL(image.url)
      }
    }
  }, [image.url])

  // Clear image state when editor is closed
  useEffect(() => {
    return () => {
      setImage({
        file: null,
        url: '',
        position: { x: 0, y: 0 },
        scale: 1,
        brightness: 100,
        contrast: 100,
        opacity: 100,
        naturalWidth: 0,
        naturalHeight: 0
      })
    }
  }, [])

  return (
    <div className="flex h-full flex-row gap-3">
      <EditorCanvas
        image={image}
        isDragging={isDragging}
        isSnapping={isSnapping}
        editorRef={editorRef}
        imageRef={imageRef}
        backgroundColor={backgroundColor}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onWheel={handleWheel}
      />
      <EditorSidebar
        image={image}
        backgroundColor={backgroundColor}
        onCenterHorizontally={handleCenterHorizontally}
        onCenterVertically={handleCenterVertically}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitWidth={handleFitWidth}
        onFitHeight={handleFitHeight}
        onBrightnessChange={handleBrightnessChange}
        onContrastChange={handleContrastChange}
        onOpacityChange={handleOpacityChange}
        onToggleBackground={toggleBackgroundColor}
        onCancel={onSave}
        onSave={handleSaveScreen}
      />
    </div>
  )
}
