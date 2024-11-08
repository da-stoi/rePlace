import type { NextPage } from 'next'
import { StaticScreenProps } from '../types'

const Batteryempty: NextPage<StaticScreenProps> = ({ theme, download }) => {

  const backgroundColor = theme === 'dark' ? '#212121' : '#fff';
  const faceColor = theme === 'dark' ? '#fff' : '#212121';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={download ? "1404" : undefined} height={download ? "1872" : undefined} viewBox="0 0 1404 1872" id='customSuspendedScreen'>
      <defs>
        <clipPath id="clip-batteryempty_v2.0">
          <rect width="1404" height="1872" />
        </clipPath>
      </defs>
      <g id="batteryempty_v2.0" data-name="batteryempty v2.0" clip-path="url(#clip-batteryempty_v2.0)">
        <rect width="1404" height="1872" fill={backgroundColor} />
        <g id="Device" transform="translate(395 533)">
          <g id="Device_Body" data-name="Device Body" transform="translate(0 0)">
            <rect id="Device_Outline" data-name="Device Outline" width="615" height="806" rx="10" fill={backgroundColor} />
            <path id="Device_Outline_-_Outline" data-name="Device Outline - Outline" d="M10,5a5.006,5.006,0,0,0-5,5V796a5.006,5.006,0,0,0,5,5H605a5.006,5.006,0,0,0,5-5V10a5.006,5.006,0,0,0-5-5H10m0-5H605a10,10,0,0,1,10,10V796a10,10,0,0,1-10,10H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z" fill={faceColor} />
            <path id="Metal_Band" data-name="Metal Band" d="M10,0H42a0,0,0,0,1,0,0V806a0,0,0,0,1,0,0H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z" fill={faceColor} />
          </g>
          <path id="Screen" d="M2,2V684.122H512.591V2H2M0,0H514.591V686.122H0Z" transform="translate(66.779 34.372)" fill={faceColor} />
        </g>
        <g id="Battery" transform="translate(36.175 33.156)" opacity="0.393">
          <path id="Battery_Outline" data-name="Battery Outline" d="M6.679-4H92.672c5.888,0,10.679,5.383,10.679,12V47c0,6.617-4.791,12-10.679,12H6.679C.791,59-4,53.617-4,47V8C-4,1.383.791-4,6.679-4ZM92.672,51c1.267,0,2.679-1.643,2.679-4V8c0-2.357-1.412-4-2.679-4H6.679C5.412,4,4,5.643,4,8V47c0,2.357,1.412,4,2.679,4Z" transform="translate(623.649 1134.844)" fill={faceColor} />
          <rect id="Battery_Bar" data-name="Battery Bar" width="9" height="41" rx="4.5" transform="translate(631 1141.844)" fill={faceColor} />
          <rect id="Cathode" width="10" height="38" rx="5" transform="translate(731 1143.844)" fill={faceColor} />
        </g>
        <path id="Mouth" d="M99.863,38.467q-.677,0-1.35,0C49.424,38.217,9.788,26.3-7.515,6.6A10,10,0,0,1-6.6-7.514,10,10,0,0,1,7.514-6.6c13.181,15.012,48.94,24.85,91.1,25.062,42.764.215,80.675-9.887,94.34-25.137a10,10,0,0,1,14.121-.775,10,10,0,0,1,.775,14.121C186.825,30.137,138.554,38.467,99.863,38.467Z" transform="translate(818.7 1039.58) rotate(180)" fill={faceColor} />
        <g id="Eyes">
          <g id="Left_Eye" data-name="Left Eye">
            <path id="Line_2" data-name="Line 2" d="M0,88.458A9.969,9.969,0,0,1-7.071,85.53a10,10,0,0,1,0-14.142L71.387-7.071a10,10,0,0,1,14.142,0,10,10,0,0,1,0,14.142L7.071,85.53A9.969,9.969,0,0,1,0,88.458Z" transform="translate(556.271 720.797)" fill={faceColor} />
            <path id="Line_3" data-name="Line 3" d="M78.458,88.458a9.969,9.969,0,0,1-7.071-2.929L-7.071,7.071a10,10,0,0,1,0-14.142,10,10,0,0,1,14.142,0L85.53,71.387a10,10,0,0,1-7.071,17.071Z" transform="translate(556.271 720.797)" fill={faceColor} />
          </g>
          <g id="Right_Eye" data-name="Right Eye">
            <path id="Line_4" data-name="Line 4" d="M0,88.458A9.969,9.969,0,0,1-7.071,85.53a10,10,0,0,1,0-14.142L71.387-7.071a10,10,0,0,1,14.142,0,10,10,0,0,1,0,14.142L7.071,85.53A9.969,9.969,0,0,1,0,88.458Z" transform="translate(802.271 720.797)" fill={faceColor} />
            <path id="Line_5" data-name="Line 5" d="M78.458,88.458a9.969,9.969,0,0,1-7.071-2.929L-7.071,7.071a10,10,0,0,1,0-14.142,10,10,0,0,1,14.142,0L85.53,71.387a10,10,0,0,1-7.071,17.071Z" transform="translate(802.271 720.797)" fill={faceColor} />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Batteryempty