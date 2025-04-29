import type { NextPage } from 'next'
import Face from './primitives/face'
import type { ScreenCreatorProps } from '../types'

const Screen: NextPage<ScreenCreatorProps> = ({ theme, faceDetails }) => {
  const backgroundColor = theme === 'dark' ? '#212121' : '#fff'
  const faceColor = theme === 'dark' ? '#fff' : '#212121'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1404 1872">
      <defs>
        <clipPath id="clip-suspended_v2.0">
          <rect
            width="1404"
            height="1872"
          />
        </clipPath>
      </defs>
      <g
        id="suspended_v2.0"
        data-name="suspended v2.0"
        clipPath="url(#clip-suspended_v2.0)">
        <rect
          width="1404"
          height="1872"
          fill={backgroundColor}
        />
        <g
          id="Device"
          transform="translate(395 533)">
          <g
            id="Device_Body"
            data-name="Device Body"
            transform="translate(0 0)">
            <rect
              id="Device_Outline"
              data-name="Device Outline"
              width="615"
              height="806"
              rx="10"
              fill={backgroundColor}
            />
            <path
              id="Device_Outline_-_Outline"
              data-name="Device Outline - Outline"
              d="M10,5a5.006,5.006,0,0,0-5,5V796a5.006,5.006,0,0,0,5,5H605a5.006,5.006,0,0,0,5-5V10a5.006,5.006,0,0,0-5-5H10m0-5H605a10,10,0,0,1,10,10V796a10,10,0,0,1-10,10H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z"
              fill={faceColor}
            />
            <path
              id="Metal_Band"
              data-name="Metal Band"
              d="M10,0H42a0,0,0,0,1,0,0V806a0,0,0,0,1,0,0H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z"
              fill={faceColor}
            />
          </g>
          <path
            id="Screen"
            d="M2,2V684.122H512.591V2H2M0,0H514.591V686.122H0Z"
            transform="translate(66.779 34.372)"
            fill={faceColor}
          />
        </g>
        <Face
          faceColor={faceColor}
          faceDetails={faceDetails}
        />
      </g>
    </svg>
  )
}

export default Screen
