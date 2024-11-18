'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import notify from '../lib/notify';
import { UpdateDetails, UserSettings } from '../types';
import { useTheme } from 'next-themes';

export default function StartupAnimation() {
  const { setTheme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  const block = useRef<HTMLDivElement>(null);
  const reText = useRef<HTMLHeadingElement>(null);
  const placeText = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (open) {
      // Change text
      reText.current!.textContent = 're';
      placeText.current!.textContent = 'Place';
    } else {
      // Change text
      reText.current!.textContent = 'r';
      placeText.current!.textContent = 'P';
    }
  }, [open]);

  useEffect(() => {
    window.ipc.getUpdate();
    window.ipc.getUserSettings();

    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      if (settings.theme) {
        setTheme(settings.theme);
      } else {
        setTheme('system');
      }

      if (settings.skipSplashScreen) {
        if (window.isProd) {
          window.location.href = './main.html';
        } else {
          window.location.href = './main';
        }
      }
    });

    window.ipc.on('get-update-res', (details: UpdateDetails | false) => {
      if (details) {
        notify(
          'Update available',
          `A new version of rePlace is available for download: ${details.name}`,
          () => {
            window.location.href = `/settings${
              window.isProd ? '.html' : ''
            }#update`;
          }
        );
      }
    });

    // Open animation
    setTimeout(() => {
      setOpen(true);
    }, 600);

    // Close animation
    setTimeout(() => {
      setOpen(false);
      // Redirect
      setTimeout(() => {
        setAnimationComplete(true);
      }, 400); // Wait for fade out animation to finish
    }, 2500);

    // Redirect
    setTimeout(() => {
      if (!window.ipc) {
        console.warn('ipc is not available on window');
        return;
      }

      if (window.isProd) {
        window.location.href = './main.html';
      } else {
        window.location.href = './main';
      }
    }, 3200);
  }, []);

  return (
    <div
      ref={block}
      className='fixed animate-all top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    >
      <div
        className={cn(
          'animate-fade-and-scale-in transition-all duration-300 w-max h-max bg-foreground px-3 py-4 rounded-2xl text-center m-auto ease-in-out',
          animationComplete ? 'opacity-0' : 'opacity-100'
        )}
        onClick={() => setOpen(!open)}
        data-open={open}
      >
        <h1
          ref={reText}
          className={cn(
            'inline-block font-bold text-6xl font-mono transition-all text-background overflow-clip m-auto ease-in-out',
            open ? 'w-[60px]' : 'w-[30px]'
          )}
        >
          r
        </h1>
        <h1
          ref={placeText}
          className={cn(
            'inline-block font-bold text-6xl font-mono transition-all text-background overflow-clip m-auto ease-in-out',
            open ? 'w-[150px]' : 'w-[38px]'
          )}
        >
          P
        </h1>
      </div>
      <br />
      <p
        className={cn(
          'text-muted-foreground text-center transition-all delay-200',
          open ? 'opacity-100' : 'opacity-0'
        )}
      >
        Built with <span className='font-mono text-xl'>❤</span> and purpose
      </p>
      <p
        className={cn(
          'text-muted-foreground text-center transition-all delay-300',
          open ? 'opacity-100' : 'opacity-0'
        )}
      >
        By Daniel Stoiber
      </p>
    </div>
  );
}
