import { NextPage } from 'next';
import styles from '../styles/Screens.module.css';
import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useTheme } from 'next-themes';
import {
  CreateScreenProps,
  CustomInfo,
  CustomizableScreenProps,
} from '../types';
import Suspended from '../customTemplates/Suspended';
import Poweroff from '../customTemplates/Poweroff';
import Batteryempty from '../customTemplates/Batteryempty';
import Overheating from '../customTemplates/Overheating';
import Rebooting from '../customTemplates/Rebooting';
import Starting from '../customTemplates/Starting';

// Render the correct custom rePlace screen
function currentScreen(screenSelect: string, data: CustomizableScreenProps) {
  const { theme, lostText, contactInfo, download } = data;

  switch (screenSelect) {
    case 'starting':
      return (
        <Starting
          theme={theme}
          download={download}
        />
      );
    case 'batteryempty':
      return (
        <Batteryempty
          theme={theme}
          download={download}
        />
      );
    case 'suspended':
      return (
        <Suspended
          theme={theme}
          lostText={lostText}
          contactInfo={contactInfo}
          download={download}
        />
      );
    case 'poweroff':
      return (
        <Poweroff
          theme={theme}
          lostText={lostText}
          contactInfo={contactInfo}
          download={download}
        />
      );
    case 'rebooting':
      return (
        <Rebooting
          theme={theme}
          download={download}
        />
      );
    case 'overheating':
      return (
        <Overheating
          theme={theme}
          download={download}
        />
      );
    default:
      return null;
  }
}

const CreateScreen: NextPage<CreateScreenProps> = ({
  connection,
  screenSelect,
  getFiles,
  setScreenSelect,
  setScreenMode,
}) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [customScreenDownloading, setCustomScreenDownloading] =
    useState<boolean>(false);
  const [lostText, setLostText] = useState<string>(
    'If found, please contact...'
  );
  const [discordUsername, setDiscordUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hasCustomInfo, setHasCustomInfo] = useState<boolean>(false);
  const { theme } = useTheme();
  const [screenTheme, setScreenTheme] = useState<'light' | 'dark'>(
    theme as 'light' | 'dark'
  );

  // Prefill custom info if it exists
  useEffect(() => {
    const customInfo = localStorage.getItem('rePlaceCustomInfo');
    if (customInfo) {
      const customInfoObj: CustomInfo = JSON.parse(customInfo);
      setLostText(customInfoObj.lostText);
      setDiscordUsername(
        customInfoObj.contactInfo.find((ci) => ci.type === 'discord')?.value ||
          ''
      );
      setPhoneNumber(
        customInfoObj.contactInfo.find((ci) => ci.type === 'phone')?.value || ''
      );
      setEmail(
        customInfoObj.contactInfo.find((ci) => ci.type === 'email')?.value || ''
      );

      setHasCustomInfo(true);
    }
  }, [
    setLostText,
    setDiscordUsername,
    setPhoneNumber,
    setEmail,
    setHasCustomInfo,
  ]);

  function saveCustomInfo() {
    const customInfo: CustomInfo = {
      lostText,
      contactInfo: [
        {
          type: 'discord',
          value: discordUsername,
        },
        {
          type: 'email',
          value: email,
        },
        {
          type: 'phone',
          value: phoneNumber,
        },
      ],
    };

    localStorage.setItem('rePlaceCustomInfo', JSON.stringify(customInfo));
  }

  function clearCustomInfo() {
    localStorage.removeItem('rePlaceCustomInfo');
    setLostText('If found, please contact...');
    setDiscordUsername('');
    setPhoneNumber('');
    setEmail('');
    setHasCustomInfo(false);
  }

  // Download current screen png
  function downloadScreen() {
    setCustomScreenDownloading(true);
    toPng(screenRef.current as HTMLElement, {
      cacheBust: true,
      width: 1404,
      height: 1872,
      pixelRatio: 1,
      canvasWidth: 1404,
      canvasHeight: 1872,
    })
      .then(function (dataUrl) {
        setCustomScreenDownloading(false);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'suspended.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function (error) {
        setCustomScreenDownloading(false);
        console.error('oops, something went wrong!', error);
      });
  }

  // Upload current screen png to reMarkable
  async function uploadScreen() {
    if (!connection) {
      alert('You must be connected to a reMarkable device to revert a screen.');
      return;
    }

    const confirmation = confirm(
      'Are you sure you want to upload this screen? This will overwrite the current screen.'
    );

    if (!confirmation) {
      return;
    }

    setUploading(true);
    setCustomScreenDownloading(true);

    // Convert svg to png
    toPng(screenRef.current as HTMLElement, {
      cacheBust: true,
      width: 1404,
      height: 1872,
      pixelRatio: 1,
      canvasWidth: 1404,
      canvasHeight: 1872,
    })
      .then(async function (dataUrl) {
        setCustomScreenDownloading(false);

        // Upload to reMarkable
        window.ipc.send('upload-file', {
          connection,
          screen: screenSelect,
          file: dataUrl,
        });

        setUploading(false);

        getFiles();
      })
      .catch(function (error) {
        setCustomScreenDownloading(false);
        setUploading(false);
        console.error('oops, something went wrong!', error);
      });
  }

  return (
    <div>
      <div className={styles.inlineHeader}>
        <h2>rePlace Screens</h2>
        <button
          className={styles.button}
          onClick={() => {
            setScreenMode('upload');
          }}
        >
          Select Screen from Files
        </button>
        <div></div>
      </div>
      <hr />
      <div>
        <div
          className={styles.screenPreview}
          style={{
            width: ['suspended', 'poweroff'].includes(screenSelect)
              ? '1000px'
              : '500px',
          }}
        >
          <div className={styles.halfWidth}>
            <div
              ref={screenRef}
              style={{
                width: ['suspended', 'poweroff'].includes(screenSelect)
                  ? ''
                  : '500px',
                border: `1px solid var(--text-color)`,
                marginBottom: '10px',
                margin: '-5px 0 0 -5px',
              }}
            >
              {currentScreen(screenSelect, {
                theme: screenTheme,
                lostText,
                contactInfo: [
                  {
                    type: 'discord',
                    value: discordUsername,
                  },
                  {
                    type: 'email',
                    value: email,
                  },
                  {
                    type: 'phone',
                    value: phoneNumber,
                  },
                ],
                download: customScreenDownloading,
              })}
            </div>
          </div>

          {['suspended', 'poweroff'].includes(screenSelect) && (
            <div className={styles.halfWidth}>
              <div className={styles.inputContainer}>
                <label
                  htmlFor='lostText'
                  className={styles.inputLabel}
                >
                  Lost Text
                </label>
                <input
                  type='text'
                  id='lostText'
                  className={styles.textInput}
                  value={lostText}
                  onChange={(e) => setLostText(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label
                  htmlFor='username'
                  className={styles.inputLabel}
                >
                  Discord Username
                </label>
                <input
                  type='text'
                  id='username'
                  className={styles.textInput}
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label
                  htmlFor='phoneNumber'
                  className={styles.inputLabel}
                >
                  Phone Number
                </label>
                <input
                  type='text'
                  id='phoneNumber'
                  className={styles.textInput}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className={styles.inputContainer}>
                <label
                  htmlFor='email'
                  className={styles.inputLabel}
                >
                  Email
                </label>
                <input
                  type='text'
                  id='email'
                  className={styles.textInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {hasCustomInfo && (
                <span>
                  <i>(Prefilled from saved info)</i>
                </span>
              )}
              <br />
              <br />
              <button
                className={styles.halfWidthButton}
                onClick={() => saveCustomInfo()}
              >
                Save Contact Info
              </button>
              <button
                className={styles.halfWidthButton}
                onClick={() => clearCustomInfo()}
              >
                Clear Contact Info Save
              </button>
            </div>
          )}

          <select
            className={styles.screenSelect}
            onChange={(option) => {
              setScreenSelect(option.target.value);
            }}
            value={screenSelect}
          >
            <option value='starting'>starting</option>
            <option value='batteryempty'>batteryempty</option>
            <option value='overheating'>overheating</option>
            <option value='poweroff'>poweroff</option>
            <option value='rebooting'>rebooting</option>
            <option value='suspended'>suspended</option>
          </select>

          <div className={styles.inputContainer}>
            <label
              htmlFor='input5'
              className={styles.inputLabel}
            >
              Dark Mode
            </label>
            <input
              type='checkbox'
              id='input5'
              className={styles.checkbox}
              checked={screenTheme === 'dark'}
              onChange={() => {
                setScreenTheme(screenTheme === 'dark' ? 'light' : 'dark');
              }}
            />
            <span className={styles.checkmark}></span>
          </div>
        </div>
        <br />
        <button
          className={styles.button}
          disabled={uploading}
          onClick={() => uploadScreen()}
        >
          Upload &quot;{screenSelect}&quot; Screen
        </button>
        <button
          className={styles.button}
          onClick={downloadScreen}
        >
          Download &quot;{screenSelect}&quot; Screen
        </button>
      </div>
    </div>
  );
};

export default CreateScreen;
