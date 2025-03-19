'use client'
import { animate } from 'motion'
import { useMotionValue, useTransform, motion } from 'motion/react'
import { useState } from 'react'

interface TiltProps {
  children: React.ReactNode
  className?: string
  onMouseOver?: () => void
  onMouseOut?: () => void
}

interface MouseMoveEvent extends React.MouseEvent<HTMLDivElement> {
  currentTarget: EventTarget & HTMLDivElement
}

export default function Tilt({
  children,
  className,
  onMouseOver,
  onMouseOut
}: TiltProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10])

  const handleMouseMove = (e: MouseMoveEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5

    if (!isHovering) {
      // Animate on first entry for smoothness
      animate(x, offsetX, { type: 'spring', stiffness: 150, damping: 20 })
      animate(y, offsetY, { type: 'spring', stiffness: 150, damping: 20 })
      setIsHovering(true)
    } else {
      // Directly set for responsiveness during movement
      x.set(offsetX)
      y.set(offsetY)
    }
  }

  const handleMouseOut = () => {
    onMouseOut()
    // Animate back to center smoothly
    animate(x, 0, { type: 'spring', stiffness: 200, damping: 20 })
    animate(y, 0, { type: 'spring', stiffness: 200, damping: 20 })
    setIsHovering(false)
  }

  return (
    <motion.div
      className={`relative motion-safe:transition-all ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
      onMouseOver={onMouseOver}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="h-full w-full">
        {children}
      </motion.div>
    </motion.div>
  )
}
