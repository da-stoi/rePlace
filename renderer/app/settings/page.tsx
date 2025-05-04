'use client'

import React from 'react'
import type { UpdateDetails, UserSettings } from '@/types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import style from '@/styles/markdown.module.css'
import {
  ChevronLeft,
  FolderGit2,
  Settings2,
  SettingsIcon,
  SkipForward,
  Sparkles,
  SquareCode,
  SunMoon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ThemeSelect } from '@/components/misc/theme-select'
import { Separator } from '@/components/ui/separator'

function DownloadUpdate({ updateDetails }: { updateDetails: UpdateDetails }) {
  if (!updateDetails) {
    return null
  }

  console.log('Update details:', updateDetails)

  return (
    <>
      <Separator className="my-4" />
      <Card className="border-foreground m-auto max-w-xl">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">New update available!</h1>
          </CardTitle>
          <CardDescription>
            <p className="font-bold">
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
            collapsible
            type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h3>What changed?</h3>
              </AccordionTrigger>
              <AccordionContent>
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  className={style.reactMarkDown}>
                  {updateDetails.body.replace(/<[^>]*>/g, '').trim()}
                </Markdown>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          {updateDetails.platformAssets &&
            updateDetails.platformAssets.length > 0 &&
            updateDetails.platformAssets.map((asset, index) => (
              <Button
                key={index}
                variant="outline"
                className="mr-2"
                onClick={() => {
                  window.ipc.externalLink(asset.browser_download_url)
                }}>
                Download {asset.name}
              </Button>
            ))}
          <div className="flex flex-row flex-wrap gap-2">
            <h3 className="text-foreground/75 text-sm">
              Other platform options:
            </h3>
            {updateDetails.otherAssets &&
              updateDetails.otherAssets.length > 0 &&
              updateDetails.otherAssets.map((asset, index) => (
                <span
                  key={index}
                  className="text-foreground/75 hover:text-foreground cursor-pointer text-nowrap text-sm underline hover:no-underline"
                  onClick={() => {
                    window.ipc.externalLink(asset.browser_download_url)
                  }}>
                  {asset.name}
                </span>
              ))}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default function Settings() {
  const { theme } = useTheme()
  const [isClient, setIsClient] = React.useState(false)

  const [userSettings, setUserSettings] = React.useState<UserSettings | null>(
    null
  )
  const [updateDetails, setUpdateDetails] =
    React.useState<UpdateDetails | null>(null)

  React.useEffect(() => {
    setIsClient(true)
    window.ipc.getUpdate()
    window.ipc.getUserSettings()

    // Listen for user settings response
    window.ipc.on('get-user-settings-res', (settings: UserSettings) => {
      setUserSettings(settings)
      window.ipc.getUpdate()
    })

    // Listen for update details response
    window.ipc.on('get-update-res', (details: UpdateDetails) => {
      setUpdateDetails(details)
    })
  }, [])

  return (
    <div className="my-14 block w-full">
      <div className="m-auto max-w-4xl px-10">
        {/* Header */}
        <div className="bg-background sticky top-14 z-50">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <SettingsIcon className="m-auto mr-3 size-8" />
              <h1
                className="my-5 text-3xl"
                id="screen-manager">
                Settings
              </h1>
            </div>
            <Button
              variant="default"
              className="my-auto"
              onClick={() => {
                window.location.href = `/main`
              }}>
              <ChevronLeft /> <h3>Back</h3>
            </Button>
          </div>
          <Separator />
        </div>

        {/* Main content */}
        <h1
          className="my-5 border-b text-2xl"
          id="customization">
          <Settings2 className="mb-1 inline" /> Customization
        </h1>
        {/* Customization */}
        <div className="ml-6">
          {/* Theme */}
          <h3 className="my-5 text-xl">
            <SunMoon className="mb-1 inline size-5" /> Theme
          </h3>
          <div className="ml-4">
            <p className="my-2">
              Choose between light and dark themes for the app.
            </p>
            {isClient && theme && <ThemeSelect />}
          </div>

          <Separator className="my-4" />

          {/* Language */}
          {/* <h3 className="my-5 text-xl">
            <Languages className="mb-1 inline size-5" /> Language
          </h3>
          <div className="ml-4">
            <p className="my-2">Choose your preferred language.</p>
          </div>

          <Separator className="my-4" /> */}

          {/* Skip splash screen */}
          <h3 className="my-5 text-xl">
            <SkipForward className="mb-1 mr-1 inline size-5" />
            Skip Splash Screen
          </h3>
          <div className="ml-4">
            <p className="my-2">
              Skip the app start splash screen animation to get into the app
              faster.
            </p>
            <div className="mt-5 flex flex-row gap-2">
              <Switch
                id="skipSplashScreen"
                checked={userSettings?.skipSplashScreen}
                onCheckedChange={checked => {
                  window.ipc.updateUserSetting('skipSplashScreen', checked)
                }}
              />
              <Label
                htmlFor="skipSplashScreen"
                className="text-md">
                Skip splash screen
              </Label>
            </div>
          </div>
        </div>

        {/* Updates */}
        <h1
          className="my-5 border-b text-2xl"
          id="update">
          <Sparkles className="mb-1 inline" /> Updates
        </h1>

        <div className="ml-6">
          <h3 className="my-5 text-xl">
            <FolderGit2 className="mb-1 mr-1 inline size-5" />
            Pre-release updates
          </h3>
          <div className="ml-4">
            <p className="my-2">
              Enable pre-release updates to receive the latest features and bug
              fixes before the stable release.
            </p>
            <p className="my-2 italic">
              Note: Pre-release updates may be unstable. Use at your own risk.
            </p>
            <div className="mt-5 flex flex-row gap-2">
              <Switch
                id="preRelease"
                checked={userSettings?.preRelease}
                onCheckedChange={checked => {
                  window.ipc.updateUserSetting('preRelease', checked)
                }}
              />
              <Label
                htmlFor="preRelease"
                className="text-md">
                Receive pre-release updates
              </Label>
            </div>
          </div>
        </div>

        {/* New Update Available */}
        <DownloadUpdate updateDetails={updateDetails} />

        {/* Developer Mode */}
        <h1
          className="my-5 border-b text-2xl"
          id="developer-mode">
          <SquareCode className="mb-1 inline" /> Developer Mode
        </h1>
        <div className="ml-6">
          <p className="my-2">
            Enable developer mode to access features needed for development and
            advanced configurations.
          </p>
          <div className="mt-5 flex flex-row gap-2">
            <Switch
              id="developerMode"
              checked={userSettings?.developerMode}
              onCheckedChange={checked => {
                window.ipc.updateUserSetting('developerMode', checked)
              }}
            />
            <Label
              htmlFor="developerMode"
              className="text-md">
              Enable developer mode
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
