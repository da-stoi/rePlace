import React from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTheme } from 'next-themes'

export function ThemeSelect() {
  const { setTheme, theme } = useTheme()

  return (
    <RadioGroup
      defaultValue="system"
      value={theme}
      onValueChange={value => {
        setTheme(value)
        window.ipc.updateUserSetting('theme', value)
      }}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="system"
          id="system"
        />
        <Label htmlFor="r1">System</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="dark"
          id="dark"
        />
        <Label htmlFor="r2">Dark</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="light"
          id="light"
        />
        <Label htmlFor="r3">Light</Label>
      </div>
    </RadioGroup>
  )
}
