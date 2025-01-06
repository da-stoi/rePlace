import React from 'react'
import { Loader2 } from 'lucide-react'

export default function PageLoader() {
  return (
    <div>
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="size-12 animate-spin" />
      </div>
    </div>
  )
}
