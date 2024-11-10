import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { UpdateDetails, UserSettings } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import style from '../styles/markdown.module.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordian';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { ChevronLeft } from 'lucide-react';

function DownloadUpdate({ updateDetails }: { updateDetails: UpdateDetails }) {
  if (!updateDetails) {
    return null;
  }

  return (
    <>
      <hr className='my-4' />
      <Card className='border-foreground'>
        <CardHeader>
          <CardTitle>
            <h1 className='text-2xl'>New update available!</h1>
          </CardTitle>
          <CardDescription>
            <p className='font-bold'>
              {updateDetails.name} is now available for download.
            </p>
            <p>
              Released:{' '}
              {new Date(updateDetails.publishedAt).toLocaleDateString()}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion
            type='single'
            collapsible
          >
            <AccordionItem value='item-1'>
              <AccordionTrigger>
                <h3>What changed?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  className={style.reactMarkDown}
                >
                  {updateDetails.body}
                </Markdown>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button
            variant='outline'
            disabled={!updateDetails.platformAsset}
            onClick={() => {
              window.ipc.externalLink(
                updateDetails.platformAsset.browser_download_url
              );
            }}
          >
            Download rePlace {updateDetails.name}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default function Settings() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [updateDetails, setUpdateDetails] = useState<UpdateDetails | null>(
    null
  );

  useEffect(() => {
    window.ipc.getUpdate();
    window.ipc.getUserSettings();

    // Listen for user settings response
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      setUserSettings(settings);
      window.ipc.getUpdate();
    });

    // Listen for update details response
    window.ipc.on('get-update-res', (details: UpdateDetails) => {
      setUpdateDetails(details);
    });
  }, []);

  return (
    <div className='my-20 block w-full'>
      <div className='max-w-4xl m-auto px-10'>
        <div className='flex flex-row justify-between'>
          <h1
            className='text-3xl my-5'
            id='settings'
          >
            Settings
          </h1>
          <Button
            variant='secondary'
            className='my-auto'
            onClick={() => {
              window.location.href = `/main${window.isProd ? '.html' : ''}`;
            }}
          >
            <ChevronLeft /> Back
          </Button>
        </div>
        <h1
          className='text-2xl my-5 border-b'
          id='update'
        >
          Updates
        </h1>

        <h3 className='text-xl my-5'>Pre-release updates</h3>
        <p className='my-2'>
          Enable pre-release updates to receive the latest features and bug
          fixes before the stable release.
        </p>
        <p className='my-2 italic'>
          Note: Pre-release updates may be unstable. Use at your own risk.
        </p>
        <div className='mt-5 flex flex-row gap-2'>
          <Switch
            id='preRelease'
            checked={userSettings?.preRelease}
            onCheckedChange={(checked) => {
              window.ipc.updateUserSetting('preRelease', checked);
            }}
          />
          <Label
            htmlFor='preRelease'
            className='text-md'
          >
            Receive pre-release updates
          </Label>
        </div>

        <DownloadUpdate updateDetails={updateDetails} />

        <h1
          className='text-2xl my-5 border-b'
          id='update'
        >
          Developer Mode
        </h1>
        <p className='my-2'>
          Enable developer mode to access advanced features needed for
          development.
        </p>
        <div className='mt-5 flex flex-row gap-2'>
          <Switch
            id='developerMode'
            checked={userSettings?.developerMode}
            onCheckedChange={(checked) => {
              window.ipc.updateUserSetting('developerMode', checked);
            }}
          />
          <Label
            htmlFor='developerMode'
            className='text-md'
          >
            Enable developer mode
          </Label>
        </div>
      </div>
    </div>
  );
}
