import React from 'react'

interface EyeProps {
  archHeight: number
  archWidth: number
  transform: string
  faceColor: string
}

const Eye: React.FC<EyeProps> = ({
  archHeight,
  archWidth,
  transform,
  faceColor
}) => (
  <path
    d={`M${-archWidth / 2},0 C${-archWidth / 4},${archHeight} ${archWidth / 4},${archHeight} ${archWidth / 2},0`}
    transform={transform}
    fill="none"
    stroke={faceColor}
    strokeWidth={20}
    strokeLinecap="round"
  />
)

interface MouthProps {
  type: 'arch' | 'ellipse'
  height: number
  width: number
  transform: string
  faceColor: string
}

const Mouth: React.FC<MouthProps> = ({
  type,
  height,
  width,
  transform,
  faceColor
}) => {
  if (type === 'arch') {
    return (
      <path
        d={`M${-width / 2},0 Q0,${height} ${width / 2},0`}
        transform={transform}
        fill="none"
        stroke={faceColor}
        strokeWidth={20}
        strokeLinecap="round"
      />
    )
  }

  return (
    <ellipse
      cx={0}
      cy={0}
      rx={width / 2 <= 2 ? 2 : width / 2}
      ry={height / 2 <= 2 ? 2 : height / 2}
      transform={transform}
      fill="none"
      stroke={faceColor}
      strokeWidth={20}
      strokeLinecap="round"
    />
  )
}

interface FaceDetailProps {
  rightEye: number[]
  leftEye: number[]
  mouth: number[]
  mouthType: 'arch' | 'ellipse'
}

interface FaceProps {
  faceColor: string
  faceDetails: FaceDetailProps
}

const Face: React.FC<FaceProps> = ({ faceColor, faceDetails }) => {
  const eyeSpacing = 120 // half spacing since both eyes are offset from center
  const deviceOffsetX = 400 // left edge of device
  const deviceWidth = 615 // width of device
  const faceCenterX = deviceOffsetX + deviceWidth / 2 + 10 // 10px metal band bias

  return (
    <g id="Face">
      <g
        id="Eyes"
        transform={`translate(${faceCenterX} 742.225)`}>
        <Eye
          archHeight={faceDetails.leftEye[0]}
          archWidth={faceDetails.leftEye[1]}
          transform={`translate(${-eyeSpacing} 0)`}
          faceColor={faceColor}
        />
        <Eye
          archHeight={faceDetails.rightEye[0]}
          archWidth={faceDetails.rightEye[1]}
          transform={`translate(${eyeSpacing} 0)`}
          faceColor={faceColor}
        />
      </g>
      <g
        id="Mouth"
        transform={`translate(${faceCenterX} 1032)`}>
        <Mouth
          type={faceDetails.mouthType}
          height={faceDetails.mouth[0]}
          width={faceDetails.mouth[1]}
          transform="translate(0 0)"
          faceColor={faceColor}
        />
      </g>
    </g>
  )
}

export default Face
