'use client'

import React, { useRef, useState, useEffect } from 'react'
import { editorWidth, editorHeight, snapThreshold } from './constants'
import { EditorCanvas } from './EditorCanvas'
import { EditorSidebar } from './EditorSidebar'
import type { UploadEditorProps, ImageState } from './types'
import type { ScreenInfo, UserSettings } from '@/types'

export const UploadEditor: React.FC<UploadEditorProps> = ({
  imageFile,
  onSave
}) => {
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
  const [isSnapping, setIsSnapping] = useState({
    horizontal: false,
    vertical: false,
    edges: []
  })
  const [userSettings, setUserSettings] = useState<UserSettings>()
  const [backgroundColor, setBackgroundColor] = useState('white')
  const editorRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Center image within the virtual editor
  const centerImage = (
    naturalWidth: number,
    naturalHeight: number,
    scale = 1
  ) => {
    const editorCenterX = editorWidth / 2
    const editorCenterY = editorHeight / 2
    const scaledWidth = naturalWidth * scale
    const scaledHeight = naturalHeight * scale
    return {
      x: editorCenterX - scaledWidth / 2,
      y: editorCenterY - scaledHeight / 2
    }
  }

  // Get user settings
  useEffect(() => {
    window.ipc.getUserSettings()
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      setUserSettings(settings)
    })
  }, [])

  // Update image when imageFile prop changes
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      const img = new Image()
      img.onload = () => {
        let initialScale = 1.0
        if (
          img.naturalWidth > editorWidth ||
          img.naturalHeight > editorHeight
        ) {
          const widthRatio = editorWidth / img.naturalWidth
          const heightRatio = editorHeight / img.naturalHeight
          initialScale = Math.min(widthRatio, heightRatio)
        }
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

  // Update image scale and position on window resize
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
    return () => window.removeEventListener('resize', handleResize)
  }, [image.url, image.naturalWidth, image.naturalHeight])

  // Drag events
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!image.url || !editorRef.current) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !editorRef.current || !image.url) return
    const editorRect = editorRef.current.getBoundingClientRect()
    const scaleRatioX = editorRect.width / editorWidth
    const scaleRatioY = editorRect.height / editorHeight
    const deltaX = (e.clientX - dragStart.x) / scaleRatioX
    const deltaY = (e.clientY - dragStart.y) / scaleRatioY
    let newX = image.position.x + deltaX
    let newY = image.position.y + deltaY
    setDragStart({ x: e.clientX, y: e.clientY })

    const editorCenterX = editorWidth / 2
    const editorCenterY = editorHeight / 2
    const scaledWidth = image.naturalWidth * image.scale
    const scaledHeight = image.naturalHeight * image.scale
    const imageCenterX = scaledWidth / 2
    const imageCenterY = scaledHeight / 2

    const horizontalCenterDiff = Math.abs(newX + imageCenterX - editorCenterX)
    const verticalCenterDiff = Math.abs(newY + imageCenterY - editorCenterY)
    const isNearHorizontalCenter = horizontalCenterDiff < snapThreshold
    const isNearVerticalCenter = verticalCenterDiff < snapThreshold
    const snappingEdges: string[] = []

    if (Math.abs(newX) < snapThreshold) {
      newX = 0
      snappingEdges.push('left')
    }
    const rightEdgePos = editorWidth - scaledWidth
    if (Math.abs(newX - rightEdgePos) < snapThreshold) {
      newX = rightEdgePos
      snappingEdges.push('right')
    }
    if (Math.abs(newY) < snapThreshold) {
      newY = 0
      snappingEdges.push('top')
    }
    const bottomEdgePos = editorHeight - scaledHeight
    if (Math.abs(newY - bottomEdgePos) < snapThreshold) {
      newY = bottomEdgePos
      snappingEdges.push('bottom')
    }
    if (isNearHorizontalCenter) {
      newX = editorCenterX - imageCenterX
    }
    if (isNearVerticalCenter) {
      newY = editorCenterY - imageCenterY
    }
    setIsSnapping({
      horizontal: isNearHorizontalCenter,
      vertical: isNearVerticalCenter,
      edges: snappingEdges
    })
    setImage({ ...image, position: { x: newX, y: newY } })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setIsSnapping({ horizontal: false, vertical: false, edges: [] })
  }

  // Scroll zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!image.url || !editorRef.current) return
    const scaleChange = e.deltaY > 0 ? -0.05 : 0.05
    const newScale = Math.max(0.1, Math.min(5, image.scale + scaleChange))

    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2

    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2
    setImage({ ...image, scale: newScale, position: { x: newX, y: newY } })
  }

  // Sidebar action handlers
  const handleCenterVertically = () => {
    if (!image.url) return
    const editorCenterX = editorWidth / 2
    const scaledWidth = image.naturalWidth * image.scale
    const imageCenterX = scaledWidth / 2
    setImage({
      ...image,
      position: { ...image.position, x: editorCenterX - imageCenterX }
    })
  }

  const handleCenterHorizontally = () => {
    if (!image.url) return
    const editorCenterY = editorHeight / 2
    const scaledHeight = image.naturalHeight * image.scale
    const imageCenterY = scaledHeight / 2
    setImage({
      ...image,
      position: { ...image.position, y: editorCenterY - imageCenterY }
    })
  }

  const handleFitWidth = () => {
    if (!image.url) return
    const newScale = editorWidth / image.naturalWidth
    const newScaledHeight = image.naturalHeight * newScale
    const editorCenterY = editorHeight / 2
    const imageCenterY = newScaledHeight / 2
    setImage({
      ...image,
      scale: newScale,
      position: { x: 0, y: editorCenterY - imageCenterY }
    })
  }

  const handleFitHeight = () => {
    if (!image.url) return
    const newScale = editorHeight / image.naturalHeight
    const newScaledWidth = image.naturalWidth * newScale
    const editorCenterX = editorWidth / 2
    const imageCenterX = newScaledWidth / 2
    setImage({
      ...image,
      scale: newScale,
      position: { x: editorCenterX - imageCenterX, y: 0 }
    })
  }

  const handleZoomIn = () => {
    if (!image.url || !editorRef.current) return
    const newScale = Math.min(5, image.scale + 0.1)
    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2
    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2
    setImage({ ...image, scale: newScale, position: { x: newX, y: newY } })
  }

  const handleZoomOut = () => {
    if (!image.url || !editorRef.current) return
    const newScale = Math.max(0.1, image.scale - 0.1)
    const currentScaledWidth = image.naturalWidth * image.scale
    const currentScaledHeight = image.naturalHeight * image.scale
    const currentCenterX = image.position.x + currentScaledWidth / 2
    const currentCenterY = image.position.y + currentScaledHeight / 2
    const newScaledWidth = image.naturalWidth * newScale
    const newScaledHeight = image.naturalHeight * newScale
    const newX = currentCenterX - newScaledWidth / 2
    const newY = currentCenterY - newScaledHeight / 2
    setImage({ ...image, scale: newScale, position: { x: newX, y: newY } })
  }

  const handleBrightnessChange = (value: number[]) => {
    setImage({ ...image, brightness: value[0] })
  }

  const handleContrastChange = (value: number[]) => {
    setImage({ ...image, contrast: value[0] })
  }

  const handleOpacityChange = (value: number[]) => {
    setImage({ ...image, opacity: value[0] })
  }

  const toggleBackgroundColor = () => {
    setBackgroundColor(prev => (prev === 'white' ? 'black' : 'white'))
  }

  // Save the edited screen
  const handleSaveScreen = () => {
    if (!image.file) return
    const canvas = document.createElement('canvas')
    canvas.width = editorWidth
    canvas.height = editorHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
      window.ipc.addScreen(screenInfo)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onSave()
    }
  }

  // Cleanup the object URL on unmount
  useEffect(() => {
    return () => {
      if (image.url) {
        URL.revokeObjectURL(image.url)
      }
    }
  }, [image.url])

  // Clear image state on unmount
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
        userSettings={userSettings}
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
        onSaveScreen={handleSaveScreen}
      />
    </div>
  )
}
