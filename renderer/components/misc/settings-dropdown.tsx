import React from 'react'
import { BookImage, Settings, Wrench } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '../ui/dropdown-menu'

export default function SettingsDropdown({
  className
}: {
  className?: string
}) {
  const navigate = (path: string) => {
    window.location.href = path
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-5 top-5">
            <Wrench />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigate('/screen-manager')}>
            <BookImage />
            Screen Manager
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
