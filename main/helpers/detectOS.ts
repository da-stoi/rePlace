import os from 'os';

export const detectOS = (): string => {
  const platform = os.platform() as string;
  return platform;
};
