'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { UpdateDetails, UserSettings } from '@/types'
import { useTheme } from 'next-themes'
import notify from '@/lib/notify'

export default function StartupAnimation() {
  const { setTheme } = useTheme()

  const [open, setOpen] = React.useState<boolean>(false)
  const [animationComplete, setAnimationComplete] =
    React.useState<boolean>(false)

  const block = React.useRef<HTMLDivElement>(null)
  const reText = React.useRef<HTMLHeadingElement>(null)
  const placeText = React.useRef<HTMLHeadingElement>(null)

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

  React.useEffect(() => {
    window.ipc.getUpdate()
    window.ipc.getUserSettings()

    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      if (settings.theme) {
        setTheme(settings.theme)
      } else {
        setTheme('system')
      }

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

    // Open animation
    setTimeout(() => {
      setOpen(true)
    }, 600)

    // Close animation
    setTimeout(() => {
      setOpen(false)
      // Redirect
      setTimeout(() => {
        setAnimationComplete(true)
      }, 400) // Wait for fade out animation to finish
    }, 2500)

    // Redirect
    setTimeout(() => {
      if (!window.ipc) {
        console.warn('ipc is not available on window')
        return
      }

      window.location.href = './main'
    }, 3200)
  }, [])

  return (
    <div
      ref={block}
      className="animate-all fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className={cn(
          'animate-fade-and-scale-in bg-foreground m-auto h-max w-max rounded-2xl px-3 py-4 text-center transition-all duration-300 ease-in-out',
          animationComplete ? 'opacity-0' : 'opacity-100'
        )}
        onClick={() => setOpen(!open)}
        data-open={open}>
        <h1
          ref={reText}
          className={cn(
            'text-background m-auto inline-block overflow-clip font-mono text-6xl font-bold transition-all ease-in-out',
            open ? 'w-[60px]' : 'w-[30px]'
          )}>
          r
        </h1>
        <h1
          ref={placeText}
          className={cn(
            'text-background m-auto inline-block overflow-clip font-mono text-6xl font-bold transition-all ease-in-out',
            open ? 'w-[150px]' : 'w-[38px]'
          )}>
          P
        </h1>
      </div>
      <br />
      <p
        className={cn(
          'text-muted-foreground text-center transition-all delay-200',
          open ? 'opacity-100' : 'opacity-0'
        )}>
        Built with <span className="font-mono text-xl">❤</span> and purpose
      </p>
      <p
        className={cn(
          'text-muted-foreground text-center transition-all delay-300',
          open ? 'opacity-100' : 'opacity-0'
        )}>
        By Daniel Stoiber
      </p>
    </div>
  )
}
