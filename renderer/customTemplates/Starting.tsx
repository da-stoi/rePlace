import type { NextPage } from 'next';
import { StaticScreenProps } from '../types';

const Starting: NextPage<StaticScreenProps> = ({ theme, download }) => {
  const backgroundColor = theme === 'dark' ? '#212121' : '#fff';
  const faceColor = theme === 'dark' ? '#fff' : '#212121';

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={download ? '1404' : undefined}
      height={download ? '1872' : undefined}
      viewBox='0 0 1404 1872'
      id='customSuspendedScreen'
    >
      <defs>
        <clipPath id='clip-starting_v2.0'>
          <rect
            width='1404'
            height='1872'
          />
        </clipPath>
      </defs>
      <g
        id='starting_v2.0'
        data-name='starting v2.0'
        clip-path='url(#clip-starting_v2.0)'
      >
        <rect
          width='1404'
          height='1872'
          fill={backgroundColor}
        />
        <g
          id='Device'
          transform='translate(395 533)'
        >
          <g
            id='Device_Body'
            data-name='Device Body'
            transform='translate(0 0)'
          >
            <rect
              id='Device_Outline'
              data-name='Device Outline'
              width='615'
              height='806'
              rx='10'
              fill={backgroundColor}
            />
            <path
              id='Device_Outline_-_Outline'
              data-name='Device Outline - Outline'
              d='M10,5a5.006,5.006,0,0,0-5,5V796a5.006,5.006,0,0,0,5,5H605a5.006,5.006,0,0,0,5-5V10a5.006,5.006,0,0,0-5-5H10m0-5H605a10,10,0,0,1,10,10V796a10,10,0,0,1-10,10H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z'
              fill={faceColor}
            />
            <path
              id='Metal_Band'
              data-name='Metal Band'
              d='M10,0H42a0,0,0,0,1,0,0V806a0,0,0,0,1,0,0H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z'
              fill={faceColor}
            />
          </g>
          <path
            id='Screen'
            d='M2,2V684.122H512.591V2H2M0,0H514.591V686.122H0Z'
            transform='translate(66.779 34.372)'
            fill={faceColor}
          />
        </g>
        <path
          id='Mouth'
          d='M0,38.467A9.962,9.962,0,0,1-6.6,35.982a10,10,0,0,1-.917-14.112C9.788,2.163,49.424-9.749,98.513-10c38.911-.2,88.067,8.053,109.335,31.79a10,10,0,0,1-14.9,13.346C179.289,19.89,141.377,9.788,98.613,10c-42.159.212-77.918,10.049-91.1,25.062A9.976,9.976,0,0,1,0,38.467Z'
          transform='translate(818.7 1039.58) rotate(180)'
          fill={faceColor}
        />
        <g
          id='Eyes'
          transform='translate(545.453 742.225)'
        >
          <path
            id='Left_Eye'
            data-name='Left Eye'
            d='M99.318,21.3a9.962,9.962,0,0,1-6.66-2.544C79.669,7.146,19.445,7.1,6.738,18.686a10,10,0,0,1-14.127-.651A10,10,0,0,1-6.738,3.908c20.348-18.557,91.986-18.6,112.723-.068A10,10,0,0,1,99.318,21.3Z'
            transform='translate(0 0)'
            fill={faceColor}
          />
          <path
            id='Right_Eye'
            data-name='Right Eye'
            d='M99.318,21.3a9.962,9.962,0,0,1-6.66-2.544C79.669,7.146,19.445,7.1,6.738,18.686a10,10,0,0,1-14.127-.651A10,10,0,0,1-6.738,3.908c20.348-18.557,91.986-18.6,112.723-.068A10,10,0,0,1,99.318,21.3Z'
            transform='translate(247.922 0)'
            fill={faceColor}
          />
        </g>
      </g>
    </svg>
  );
};

export default Starting;
