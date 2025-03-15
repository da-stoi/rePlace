'use client'

import React from 'react'
import { UpdateDetails, UserSettings } from '@/types'
import { useTheme } from 'next-themes'
import notify from '@/lib/notify'
import { motion } from 'motion/react'

export default function StartupAnimation() {
  const { setTheme } = useTheme()

  const [open, setOpen] = React.useState<boolean>(false)
  const [animationComplete, setAnimationComplete] =
    React.useState<boolean>(false)
  const [fadeInComplete, setFadeInComplete] = React.useState<boolean>(false)

  const block = React.useRef<HTMLDivElement>(null) // Block element
  const reText = React.useRef<HTMLHeadingElement>(null) // r/re text
  const placeText = React.useRef<HTMLHeadingElement>(null) // P/Place text

  // Spring animation properties
  const springProps = {
    type: 'spring',
    stiffness: 200,
    damping: 20
  }

  // Change text on open
  React.useEffect(() => {
    if (open) {
      // Change text
      reText.current!.textContent = 're'
      placeText.current!.textContent = 'Place'
    } else {
      // Change text
      reText.current!.textContent = 'r'
      placeText.current!.textContent = 'P'
    }
  }, [open])

  // Get user settings and check for updates, then animate
  React.useEffect(() => {
    window.ipc.getUpdate()
    window.ipc.getUserSettings()

    // Get user settings
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      // Set theme
      if (settings.theme) {
        setTheme(settings.theme)
      } else {
        setTheme('system') // Default to system theme
      }

      // Skip splash screen if enabled
      if (settings.skipSplashScreen) {
        window.location.href = './main'
      }
    })

    window.ipc.on('get-update-res', (details: UpdateDetails | false) => {
      if (details) {
        notify(
          'Update available',
          `A new version of rePlace is available for download: ${details.name}`,
          () => {
            window.location.href = `/settings#update`
          }
        )
      }
    })

    // Fade in animation
    setTimeout(() => {
      setFadeInComplete(true) // Fade in
    }, 600)

    // Scale animation
    setTimeout(() => {
      setOpen(true) // Scale in
      setTimeout(() => {
        setOpen(false) // Scale out
      }, 2000)
    }, 1200)

    // Fade out animation
    setTimeout(() => {
      setAnimationComplete(true) // Fade out
    }, 3500)
  }, [])

  // Redirect to main page
  React.useEffect(() => {
    if (animationComplete) {
      window.location.href = './main'
    }
  }, [animationComplete])

  return (
    <motion.div
      ref={block}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadeInComplete ? (animationComplete ? 0 : 1) : 0 }}
      transition={{ duration: 0.4, ...springProps }}>
      <motion.div
        className="bg-foreground m-auto h-max w-max rounded-2xl px-3 py-4 text-center"
        onClick={() => setOpen(!open)}
        data-open={open}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: open ? 1.2 : 1, opacity: fadeInComplete ? 1 : 0 }}
        transition={{ duration: 0.2, ...springProps }}>
        <motion.h1
          ref={reText}
          className="text-background m-auto inline-block overflow-clip font-mono text-6xl font-bold"
          initial={{ width: '30px' }}
          animate={{ width: open ? '60px' : '30px' }}
          transition={{ duration: 0.2, ...springProps }}>
          r
        </motion.h1>
        <motion.h1
          ref={placeText}
          className="text-background m-auto inline-block overflow-clip font-mono text-6xl font-bold"
          initial={{ width: '38px' }}
          animate={{ width: open ? '150px' : '38px' }}
          transition={{ duration: 0.2, ...springProps }}>
          P
        </motion.h1>
      </motion.div>
      <br />
      <motion.p
        className="text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeInComplete ? 1 : 0 }}
        transition={{ delay: 0.2, ...springProps }}>
        Built with <span className="font-mono text-xl">❤</span> and purpose
      </motion.p>
      <motion.p
        className="text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeInComplete ? 1 : 0 }}
        transition={{ delay: 0.3, ...springProps }}>
        By Daniel Stoiber
      </motion.p>
    </motion.div>
  )
}
