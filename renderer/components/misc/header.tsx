import React from 'react'

export default function Header() {
  return (
    <div className="titlebar bg-background fixed top-0 z-50 flex w-full justify-center py-4">
      <div className="space-x-2">
        <div className="bg-foreground inline-flex size-8 items-center justify-center rounded-md">
          <h1 className="text-background text-center text-xl font-bold">rP</h1>
        </div>
        <h1 className="inline h-8 text-2xl">rePlace</h1>
      </div>
    </div>
  )
}
