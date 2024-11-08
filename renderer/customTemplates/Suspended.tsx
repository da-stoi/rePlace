import type { NextPage } from 'next'
import { CustomizableScreenProps } from '../types'
import ContactInfo from './ContactInfo'

const Suspended: NextPage<CustomizableScreenProps> = ({ theme, lostText, contactInfo, download }) => {

  const backgroundColor = theme === 'dark' ? '#212121' : '#fff';
  const faceColor = theme === 'dark' ? '#fff' : '#212121';
  const lostTextColor = theme === 'dark' ? '#dadada' : '#656565';
  const contactInfoColor = theme === 'dark' ? '#a0a0a0' : '#939191';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={download ? "1404" : undefined} height={download ? "1872" : undefined} viewBox="0 0 1404 1872" id='customSuspendedScreen'>
      <defs>
        <clipPath id="clip-suspended_v2.0">
          <rect width="1404" height="1872" />
        </clipPath>
      </defs>
      <g id="suspended_v2.0" data-name="suspended v2.0" clip-path="url(#clip-suspended_v2.0)">
        <rect width="1404" height="1872" fill={backgroundColor} />
        <g id="Zs">
          <text id="z" transform="translate(1061 371)" fill={faceColor} font-size="200" font-family="var(--main-font-family)" font-weight="500"><tspan x="0" y="0">z</tspan></text>
          <text id="z-2" data-name="z" transform="translate(989 472)" fill={faceColor} font-size="150" font-family="var(--main-font-family)" font-weight="500"><tspan x="0" y="0">z</tspan></text>
        </g>
        <g id="Device" transform="translate(395 533)">
          <g id="Device_Body" data-name="Device Body" transform="translate(0 0)">
            <rect id="Device_Outline" data-name="Device Outline" width="615" height="806" rx="10" fill={backgroundColor} />
            <path id="Device_Outline_-_Outline" data-name="Device Outline - Outline" d="M10,5a5.006,5.006,0,0,0-5,5V796a5.006,5.006,0,0,0,5,5H605a5.006,5.006,0,0,0,5-5V10a5.006,5.006,0,0,0-5-5H10m0-5H605a10,10,0,0,1,10,10V796a10,10,0,0,1-10,10H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z" fill={faceColor} />
            <path id="Metal_Band" data-name="Metal Band" d="M10,0H42a0,0,0,0,1,0,0V806a0,0,0,0,1,0,0H10A10,10,0,0,1,0,796V10A10,10,0,0,1,10,0Z" fill={faceColor} />
          </g>
          <path id="Screen" d="M2,2V684.122H512.591V2H2M0,0H514.591V686.122H0Z" transform="translate(66.779 34.372)" fill={faceColor} />
        </g>
        <g id="Face">
          <g id="Eyes" transform="translate(545.454 742.225)">
            <path id="Left_Eye" data-name="Left Eye" d="M49.495,27.8h-.523C22.705,27.675,1.329,19.418-8.208,5.712a10,10,0,0,1,2.5-13.92,10,10,0,0,1,13.92,2.5C13.77,2.28,30.19,7.711,49.067,7.8c19.344.092,36.263-5.369,42.1-13.59a10,10,0,0,1,13.943-2.364A10,10,0,0,1,107.475,5.79C95.942,22.03,70.068,27.8,49.495,27.8Z" transform="translate(0 0)" fill={faceColor} />
            <path id="Right_Eye" data-name="Right Eye" d="M49.495,27.8h-.523C22.705,27.675,1.329,19.418-8.208,5.712a10,10,0,0,1,2.5-13.92,10,10,0,0,1,13.92,2.5C13.77,2.28,30.19,7.711,49.067,7.8c19.344.092,36.263-5.369,42.1-13.59a10,10,0,0,1,13.943-2.364A10,10,0,0,1,107.475,5.79C95.942,22.03,70.068,27.8,49.495,27.8Z" transform="translate(247.922 0)" fill={faceColor} />
          </g>
          <g id="Mouth" transform="translate(-3826 -4525)">
            <path id="Mouth_Outline" data-name="Mouth Outline" d="M147.5,20C65,20,20,48.406,20,63s45,43,127.5,43S275,77.594,275,63,230,20,147.5,20m0-20C228.962,0,295,28.206,295,63s-66.038,63-147.5,63S0,97.794,0,63,66.038,0,147.5,0Z" transform="translate(4397 5494)" fill={faceColor} />
            <path id="Slobber" d="M228,228a21.982,21.982,0,0,1-22-22V171.75a22,22,0,1,1-44,0V125.7a312.006,312.006,0,0,0,47.749-5.568,217.96,217.96,0,0,0,39.79-11.638A22.153,22.153,0,0,1,250,113v93a21.982,21.982,0,0,1-22,22Z" transform="translate(4397 5493)" fill={faceColor} />
          </g>
        </g>
        <g id="Text">
          {lostText && <text id="lostMessage" data-name={lostText} transform="translate(702 1773)" fill={lostTextColor} font-size="50" font-family="var(--main-font-family)" font-weight="500" textAnchor='middle'><tspan x="0" y="0">{lostText}</tspan></text>}
          {contactInfo && <ContactInfo contactInfo={contactInfo} textColor={contactInfoColor} />}
        </g>
      </g>
    </svg>
  )
}

export default Suspended