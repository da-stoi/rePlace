type Connection = {
  host: string
  port: number
  username: string
  password: string
}

type StaticScreenProps = {
  theme: 'light' | 'dark'
  download: boolean
}

type CustomInfo = {
  lostText: string
  contactInfo: {
    type: string
    value: string
  }[]
}

type CustomizableScreenProps = {
  theme: 'light' | 'dark'
  lostText: string
  contactInfo: {
    type: string
    value: string
  }[]
  download: boolean
}

type CurrentScreensProps = {
  connection: Connection | null
  files: ScreenInfo[]
  // updateConnection: Function
  // setFiles: Function
  getFiles: (connection: Connection) => ScreenInfo[]
  // setScreenSelect: Function
  // revertScreen: Function
}

type UploadScreenProps = {
  connection: Connection | null
  screenUpload: File | null
  screenSelect: string
  uploading: boolean
  getImageDimensions: (file: File) => Promise<{ width: number; height: number }>
  // clearScreenUpload: Function
  // setScreenUpload: Function
  getFiles: (connection: Connection) => ScreenInfo[]
  // setScreenSelect: Function
  // setScreenMode: Function
}

type CreateScreenProps = {
  connection: Connection | null
  screenSelect: string
  getFiles: (connection: Connection) => ScreenInfo[]
  // setScreenSelect: Function
  // setScreenMode: Function
}

type HostStatus = {
  id: string
  alive: boolean
}

type DeviceMethod = 'wifi' | 'usb' | 'redockable'
type DeviceType = 'rm1' | 'rm2' | 'rmpro' | 'redockable'

type DeviceInfo = {
  id?: string
  addDate?: Date
  type?: DeviceType
  method?: DeviceMethod
  displayName?: string
  connection?: Connection
}

type UserSettings = {
  theme: 'dark' | 'light' | 'system' // The user's theme
  skipSplashScreen: boolean // If the user wants to see the splash screen
  preRelease: boolean // If the user wants to receive pre-release updates
  developerMode: boolean // If the user wants to enable developer mode
}

type Asset = {
  platform: string
  browser_download_url?: string
  browserDownloadUrl?: string
}

type UpdateDetails = {
  id: number // tag_name
  name: string // name
  preRelease: boolean // prerelease
  publishedAt: string // published_at
  body: string
  platformAsset?: Asset
  assets: Asset[]
}

type ScreenInfo = {
  id: string
  name: string
  dataUrl: string
  addDate: Date
}

type UpdateData = {
  tag_name: string
  name: string
  id: number
  draft: boolean
  prerelease: boolean
  published_at: string
  body: string
  assets: Asset[]
}

type WindowState = {
  x: number
  y: number
  width: number
  height: number
}

// Export
export type {
  Connection,
  StaticScreenProps,
  CustomInfo,
  CustomizableScreenProps,
  CurrentScreensProps,
  UploadScreenProps,
  CreateScreenProps,
  DeviceInfo,
  DeviceMethod,
  DeviceType,
  HostStatus,
  UserSettings,
  UpdateDetails,
  Asset,
  ScreenInfo,
  UpdateData,
  WindowState
}
