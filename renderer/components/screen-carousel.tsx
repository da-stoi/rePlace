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
import { Save, Trash, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from './ui/input';
import { Dialog, DialogContent } from './ui/dialog';

function ScreenPreview({ screen }: { screen: ScreenInfo }) {
  const [hovered, setHovered] = useState(false);
  const [screenName, setScreenName] = useState(screen.name);
  const [screenPreviewOpen, setScreenPreviewOpen] = useState(false);

  const removeScreen = (id: string) => {
    window.ipc.removeScreen(id);
  };

  const updateName = (name: string) => {
    window.ipc.addScreen({ ...screen, name });
  };

  return (
    <div className='relative p-2'>
      <Button
        variant='secondary'
        size='sm'
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => removeScreen(screen.id)}
        className={cn(
          'transition-all delay-75 absolute bottom-12 right-1/2 translate-x-1/2 -translate-y-1/2',
          hovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Trash />
      </Button>
      <Image
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => setScreenPreviewOpen(true)}
        src={screen.dataUrl}
        alt={screen.name}
        width={220}
        height={280}
        className='m-auto my-2 rounded-md border'
      />
      <div className='flex flex-row gap-2 mx-3'>
        <Input
          value={screenName}
          className='text-center h-8 text-sm transition-all w-full'
          onChange={(e) => setScreenName(e.target.value)}
        />
        <Button
          variant='default'
          size='icon'
          className={cn(
            'w-10 h-8 text-background',
            screenName === screen.name ? 'hidden' : ''
          )}
          onClick={() => updateName(screenName)}
        >
          <Save />
        </Button>
      </div>
      <Dialog
        open={screenPreviewOpen}
        onOpenChange={() => {
          setScreenPreviewOpen(false);
        }}
      >
        <DialogContent className='m-auto w-max p-0'>
          <Button
            variant='secondary'
            size='icon'
            className='absolute top-3 right-3 opacity-50'
            onClick={() => setScreenPreviewOpen(false)}
          >
            <X />
          </Button>
          <Image
            src={screen.dataUrl}
            alt={screen.name}
            width={600}
            height={800}
            className='rounded-md h-screen max-h-[800px] w-auto m-auto'
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ScreenCarousel({ className }: { className?: string }) {
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
    <div className={cn('max-w-64 select-none', className)}>
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
