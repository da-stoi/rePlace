type ScreenFile = {
  name: string;
  dataUrl: string;
};

type Connection = {
  host: string;
  username: string;
  password: string;
};

type StaticScreenProps = {
  theme: 'light' | 'dark';
  download: boolean;
};

type CustomInfo = {
  lostText: string;
  contactInfo: {
    type: string;
    value: string;
  }[];
};

type CustomizableScreenProps = {
  theme: 'light' | 'dark';
  lostText: string;
  contactInfo: {
    type: string;
    value: string;
  }[];
  download: boolean;
};

type CurrentScreensProps = {
  connection: Connection | null;
  files: ScreenFile[];
  updateConnection: Function;
  setFiles: Function;
  getFiles: Function;
  setScreenSelect: Function;
  revertScreen: Function;
};

type UploadScreenProps = {
  connection: Connection | null;
  screenUpload: File | null;
  screenSelect: string;
  uploading: boolean;
  getImageDimensions: Function;
  clearScreenUpload: Function;
  setScreenUpload: Function;
  getFiles: Function;
  setScreenSelect: Function;
  setScreenMode: Function;
};

type CreateScreenProps = {
  connection: Connection | null;
  screenSelect: string;
  getFiles: Function;
  setScreenSelect: Function;
  setScreenMode: Function;
};

type DeviceInfo = {
  id?: string;
  addDate?: Date;
  type?: 'rm1' | 'rm2' | 'rmPro';
  method?: 'wifi' | 'usb';
  displayName?: string;
  connection?: Connection;
};

// Export
export type {
  ScreenFile,
  Connection,
  StaticScreenProps,
  CustomInfo,
  CustomizableScreenProps,
  CurrentScreensProps,
  UploadScreenProps,
  CreateScreenProps,
  DeviceInfo,
};
