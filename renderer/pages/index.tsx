'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export default function StartupAnimation() {
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
      console.log('window', window);

      if (!window.ipc) {
        console.warn('ipc is not available on window');
        return;
      }

      console.log('isProd', window.isProd);

      // window.location.href = `./connection${
      //   window.isProd ? '.html' : ''
      // }?host=192.168.1.198&username=root&password=c8o6axKmX2`;

      if (window.isProd) {
        window.location.href = './connect.html';
      } else {
        window.location.href = './connect';
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
        Built with ❤️ and purpose
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
