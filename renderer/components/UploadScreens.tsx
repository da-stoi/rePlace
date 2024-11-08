import { NextPage } from 'next';
import styles from '../styles/Screens.module.css';
import { UploadScreenProps } from '../types';
import { useState } from 'react';
import Image from 'next/image';

const UploadScreen: NextPage<UploadScreenProps> = ({
  connection,
  screenUpload,
  screenSelect,
  getImageDimensions,
  clearScreenUpload,
  setScreenUpload,
  getFiles,
  setScreenSelect,
  setScreenMode,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);

  async function uploadScreen() {
    if (!screenUpload) {
      return;
    }

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

    // Convert file to data url
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(screenUpload);
    });

    // const uploadReq = await fetch('../api/upload', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-host': connection.host,
    //     'x-username': connection.username,
    //     'x-password': connection.password,
    //   },
    //   body: JSON.stringify({
    //     screen: screenSelect,
    //     file: dataUrl,
    //   }),
    // });

    window.ipc.send('upload-screen', {
      screen: screenSelect,
      file: dataUrl,
      connection: {
        host: connection.host,
        username: connection.username,
        password: connection.password,
      },
    });

    setUploading(false);

    getFiles();

    // if (uploadReq.status === 200) {
    //   getFiles();
    //   alert('Upload successful!');
    // } else {
    //   alert('Upload failed.');
    // }
  }

  return (
    <div>
      <div className={styles.inlineHeader}>
        <h2>Upload Screen from Files</h2>
        <button
          className={styles.button}
          onClick={() => {
            setScreenMode('create');
          }}
        >
          Create Custom rePlace Screen
        </button>
        <button
          className={styles.button}
          onClick={() => {
            // Download template
            const link = document.createElement('a');
            link.href = 'screens/blank_screen_template.png';
            link.download = 'blank_screen_template.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download Blank Template
        </button>
      </div>
      <hr />
      <label
        htmlFor='screenUpload'
        className={styles.button}
      >
        Select Image
      </label>
      <input
        className={styles.screenUpload}
        id='screenUpload'
        type='file'
        accept='.png'
        name='file'
        onChange={async (file) => {
          if (file.target.files) {
            // Get dimensions
            const dimensions = (await getImageDimensions(
              file.target.files[0]
            )) as any;
            if (dimensions.width !== 1404 || dimensions.height !== 1872) {
              clearScreenUpload();
              alert('Image must be 1404x1872');
              return;
            }
            setScreenUpload(file.target.files[0]);
          }
        }}
      />
      <button
        className={styles.button}
        disabled={!screenUpload}
        onClick={() => clearScreenUpload()}
      >
        Clear Selection
      </button>
      {screenUpload && (
        <div>
          <div className={styles.screenPreview}>
            <Image
              src={URL.createObjectURL(screenUpload)}
              alt={`Uploaded file for ${screenSelect} screen`}
              width='234'
              height='312'
            />
            <hr />
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
          </div>
          <br />
          <button
            className={styles.button}
            disabled={uploading}
            onClick={() => uploadScreen()}
          >
            Upload &quot;{screenSelect}&quot; Screen
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;
