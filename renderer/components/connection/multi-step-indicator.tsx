import React from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '../ui/progress'

interface MultiStepIndicatorProps {
  totalSteps: number
  currentStep: number
  showStepNumbers?: boolean
  startLabel?: string
  endLabel?: string
  endpointSize?: 'small' | 'medium' | 'large'
  className?: string
}

const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({
  totalSteps,
  currentStep,
  showStepNumbers = true,
  startLabel,
  endLabel,
  endpointSize = 'medium',
  className
}) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  const endpointSizeClasses = {
    small: 'w-4 h-4 text-xs -mt-[5px]',
    medium: 'w-6 h-6 text-sm -mt-[9px]',
    large: 'w-8 h-8 text-base -mt-[13px]'
  }

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)}>
      <div className="relative">
        <Progress
          value={progress}
          className="h-3"
        />
        {/* Progress bar background */}
        {/* <div className="bg-secondary h-3 rounded-full" /> */}

        {/* Progress bar fill */}
        {/* <div
          className="bg-foreground absolute top-0 h-1 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        /> */}

        {/* Step indicators */}
        <div className="absolute left-0 top-1/4 flex w-full items-center justify-between">
          {Array.from({ length: totalSteps }).map((_item, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-in-out',
                endpointSizeClasses[endpointSize],
                index < currentStep
                  ? 'bg-foreground text-background'
                  : 'bg-secondary'
              )}>
              {showStepNumbers && index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      {(startLabel || endLabel) && (
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  )
}

export default MultiStepIndicator
