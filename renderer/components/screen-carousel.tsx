import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel';
import { ScreenInfo } from '../types';
import Image from 'next/image';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { cn } from '../lib/utils';

function ScreenPreview({ screen }: { screen: ScreenInfo }) {
  const [hovered, setHovered] = useState(false);

  const removeScreen = (id: string) => {
    window.ipc.removeScreen(id);
  };

  return (
    <div className='relative'>
      <Button
        variant='secondary'
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => removeScreen(screen.id)}
        className={cn(
          'transition-all delay-75 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2',
          hovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Trash /> Remove Screen
      </Button>
      <Image
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        src={screen.dataUrl}
        alt={screen.name}
        width={220}
        height={280}
        className='m-auto my-2 rounded-md bg-black'
      />
    </div>
  );
}

export function ScreenCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [screens, setScreens] = useState<ScreenInfo[]>([]);

  useEffect(() => {
    window.ipc.getScreens();

    window.ipc.on('get-screens-res', (screens: ScreenInfo[]) => {
      setScreens(screens);
    });
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (screens.length === 0) {
    return (
      <div className='text-center my-10'>
        <h3 className='text-xl'>No saved screens</h3>
        <p className='text-muted-foreground'>
          Upload or create a screen to get started.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-64 select-none'>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {screens.map((screen, index) => (
            <CarouselItem
              key={index}
              className='text-center'
            >
              <ScreenPreview screen={screen} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className='py-2 text-center text-sm text-muted-foreground'>
        Saved screen {current} of {screens.length}
      </div>
    </div>
  );
}
