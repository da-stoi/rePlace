import { NextPage } from 'next';
import styles from '../styles/Screens.module.css';
import { CurrentScreensProps } from '../types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const CurrentScreens: NextPage<CurrentScreensProps> = ({
  connection,
  updateConnection,
  files,
  setFiles,
  getFiles,
  setScreenSelect,
  revertScreen,
}) => {
  const [host, setHost] = useState<string>(connection?.host || '10.11.99.1');
  const [username, setUsername] = useState<string>(
    connection?.username || 'root'
  );
  const [password, setPassword] = useState<string>(connection?.password || '');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    if (connection) {
      setHost(connection.host);
      setUsername(connection.username);
      setPassword(connection.password);
    }
  }, [connection]);

  function clearConnection() {
    setHost('10.11.99.1');
    setUsername('root');
    setPassword('');
    updateConnection(null);
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.inlineHeader}>
        <h2>Current Screens</h2>
        <Button
          className={styles.button}
          onClick={() => {
            setFiles([]);
            getFiles();
          }}
        >
          {files && files.length > 0 ? 'Reload' : 'Connect'}
        </Button>
      </div>
      <hr />
      {/* Main Content */}
      {files && files.length > 0 ? (
        files.map((file: any) => {
          return (
            <div
              className={styles.screenPreview}
              key={file.name}
            >
              <div
                onClick={() => {
                  setScreenSelect(file.name.split('.png')[0]);
                }}
              >
                <Image
                  key={file}
                  src={file.dataUrl}
                  width='234'
                  height='312'
                  alt={`Current reMarkable ${file.name} screen preview`}
                />
                <hr />
                <h3 style={{ textAlign: 'center', margin: '5px' }}>
                  {file.name.split('.png')[0]}
                </h3>
              </div>
              <Button
                className={styles.halfWidthButton}
                onClick={() => {
                  // Download
                  const link = document.createElement('a');
                  link.href = file.dataUrl;
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Download
              </Button>
              <Button
                className={styles.halfWidthButton}
                onClick={() => {
                  revertScreen(file.name.split('.png')[0]);
                }}
              >
                Revert
              </Button>
            </div>
          );
        })
      ) : (
        <div style={{ padding: '0 20px' }}>
          <h2>Disconnected. {!connection && 'No connection details'}</h2>
          {!connection && (
            <h3>Enter connection details below to get started.</h3>
          )}

          <div>
            <div className={styles.inputContainer}>
              <label
                htmlFor='host'
                className={styles.inputLabel}
              >
                Host (reMarkable IP Address)
              </label>
              <input
                type='text'
                id='host'
                className={`${styles.textInput} ${styles.maxWidthInput}`}
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label
                htmlFor='username'
                className={styles.inputLabel}
              >
                Username (Default: &quot;root&quot;)
              </label>
              <Input
                type='text'
                id='username'
                // className={`${styles.textInput} ${styles.maxWidthInput}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.inputContainer}>
              <label
                htmlFor='password'
                className={styles.inputLabel}
              >
                Password
              </label>
              <Input
                type={passwordVisible ? 'text' : 'password'}
                id='password'
                // className={`${styles.textInput} ${styles.maxWidthInput}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Password visibility toggle */}
              <Button
                className={styles.button}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='22'
                    viewBox='0 -960 960 960'
                    width='22'
                    style={{ marginTop: '-5px', marginBottom: '-6px' }}
                  >
                    <path
                      fill='var(--text-color)'
                      d='M790.461-85.233 628.616-245.848q-35.385 13.693-72.731 19.77T480-220.001q-126.307 0-231.345-67.192t-166.5-177.115q-5-8.615-7.307-17.538Q72.54-490.769 72.54-500t2.5-18.346q2.5-9.115 7.5-17.346 23.923-39.769 50.846-76.962 26.924-37.192 62.616-65.807l-110.77-112 42.154-42.153 705.228 705.228-42.153 42.153ZM480-336.924q13.308 0 25.423-1.577 12.116-1.577 23.655-6.885L325.386-549.078q-4.923 11.539-6.692 23.655-1.77 12.115-1.77 25.423 0 68.076 47.5 115.576T480-336.924Zm278.153 20.308L632.691-441.078q5.077-14.307 7.731-28.846 2.654-14.538 2.654-30.076 0-68.076-47.5-115.576T480-663.076q-15.538 0-30.076 2.846-14.539 2.846-28.461 9.308l-100.077-99.692q38.153-15.077 77.807-22.231 39.653-7.154 80.807-7.154 126.692 0 232.422 67.5t166.807 178.192q4.616 7.615 7.116 16.346 2.5 8.73 2.5 17.961 0 9.231-2.193 17.961-2.192 8.731-6.807 16.346-23.231 43.539-53 81.269-29.769 37.731-68.692 67.808ZM587.385-486 467-606q25.231-5 49.154 3.615 23.923 8.616 41.307 26.846 17.77 18 25.654 41.385Q591-510.769 587.385-486Z'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='22'
                    viewBox='0 -960 960 960'
                    width='22'
                    style={{ marginTop: '-5px', marginBottom: '-6px' }}
                  >
                    <path
                      fill='var(--text-color)'
                      d='M480.091-336.924q67.985 0 115.485-47.59 47.5-47.591 47.5-115.577 0-67.985-47.59-115.485-47.591-47.5-115.577-47.5-67.985 0-115.485 47.59-47.5 47.591-47.5 115.577 0 67.985 47.59 115.485 47.591 47.5 115.577 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 171.999q-126.307 0-231.037-67.385Q144.232-354.77 81.771-464.693q-5-8.615-7.308-17.365-2.308-8.751-2.308-17.962t2.308-17.941q2.308-8.731 7.308-17.346 62.461-109.923 167.192-177.307Q353.693-779.999 480-779.999t231.037 67.385q104.731 67.384 167.192 177.307 5 8.615 7.308 17.365 2.308 8.751 2.308 17.962t-2.308 17.941q-2.308 8.731-7.308 17.346-62.461 109.923-167.192 177.307Q606.307-220.001 480-220.001Z'
                    />
                  </svg>
                )}
              </Button>
            </div>

            <div style={{ maxWidth: '330px' }}>
              <Button
                className={styles.halfWidthButton}
                disabled={
                  connection?.host === host &&
                  connection?.username === username &&
                  connection?.password === password
                }
                onClick={() => {
                  updateConnection({
                    host,
                    username,
                    password,
                  });
                }}
              >
                Save Connection
              </Button>
              <Button
                className={styles.halfWidthButton}
                onClick={() => clearConnection()}
              >
                Clear Connection
              </Button>
            </div>
          </div>
          <h3>
            Ensure your reMarkable&apos;s IP address and password is correctly
            set below and that the device is switched on (must not be on the
            sleeping screen).
          </h3>
          <h4>
            For information on finding your device IP address and password visit
            the{' '}
            <a
              href='https://remarkable.guide/guide/access/ssh.html#finding-your-device-password-and-ip-addresses'
              target='_blank'
              rel='noreferrer'
            >
              reMarkable help page
            </a>
            .
          </h4>
        </div>
      )}
    </div>
  );
};

export default CurrentScreens;
