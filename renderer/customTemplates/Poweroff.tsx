import type { NextPage } from 'next';
import { CustomizableScreenProps } from '../types';
import ContactInfo from './ContactInfo';

const Poweroff: NextPage<CustomizableScreenProps> = ({
  theme,
  lostText,
  contactInfo,
  download,
}) => {
  const backgroundColor = theme === 'dark' ? '#212121' : '#fff';
  const faceColor = theme === 'dark' ? '#fff' : '#212121';
  const lostTextColor = theme === 'dark' ? '#dadada' : '#656565';
  const contactInfoColor = theme === 'dark' ? '#a0a0a0' : '#939191';

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={download ? '1404' : undefined}
      height={download ? '1872' : undefined}
      viewBox='0 0 1404 1872'
      id='customSuspendedScreen'
    >
      <defs>
        <clipPath id='clip-poweroff_v2.0'>
          <rect
            width='1404'
            height='1872'
          />
        </clipPath>
      </defs>
      <g
        id='poweroff_v2.0'
        data-name='poweroff v2.0'
        clip-path='url(#clip-poweroff_v2.0)'
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
        <g id='Face'>
          <g
            id='Eyes'
            transform='translate(545.454 742.225)'
          >
            <path
              id='Left_Eye'
              data-name='Left Eye'
              d='M49.543,10.5c-20.824,0-41.607-.168-49.946-.5A10,10,0,0,1-9.992-.4,10,10,0,0,1,.4-9.992c16.4.662,81.78.662,98.523,0A10,10,0,0,1,109.313-.4a10,10,0,0,1-9.6,10.387C91.213,10.329,70.357,10.5,49.543,10.5Z'
              transform='translate(0 0)'
              fill={faceColor}
            />
            <path
              id='Right_Eye'
              data-name='Right Eye'
              d='M49.543,10.5c-20.824,0-41.607-.168-49.946-.5A10,10,0,0,1-9.992-.4,10,10,0,0,1,.4-9.992c16.4.662,81.78.662,98.523,0A10,10,0,0,1,109.313-.4a10,10,0,0,1-9.6,10.387C91.213,10.329,70.357,10.5,49.543,10.5Z'
              transform='translate(247.922 0)'
              fill={faceColor}
            />
          </g>
          <path
            id='Mouth'
            d='M200.4,10.5l-.2,0c-33.987-.666-166.7-.666-200,0A10,10,0,0,1-10,.7,10,10,0,0,1-.2-9.5c33.437-.669,166.676-.669,200.8,0a10,10,0,0,1-.192,20Z'
            transform='translate(818.7 1040.648) rotate(180)'
            fill={faceColor}
          />
        </g>
        <g id='Text'>
          {lostText && (
            <text
              id='lostMessage'
              data-name={lostText}
              transform='translate(702 1773)'
              fill={lostTextColor}
              font-size='50'
              font-family='var(--header-font-family)'
              font-weight='500'
              textAnchor='middle'
            >
              <tspan
                x='0'
                y='0'
              >
                {lostText}
              </tspan>
            </text>
          )}
          {contactInfo && (
            <ContactInfo
              contactInfo={contactInfo}
              textColor={contactInfoColor}
            />
          )}
        </g>
      </g>
    </svg>
  );
};

export default Poweroff;
