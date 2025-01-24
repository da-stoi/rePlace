import React from 'react'
import '@/styles/globals.css'
// import localFont from 'next/font/local'

import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import ThemeProvider from '@/components/providers/theme-provider'
import Header from '@/components/misc/header'

// const lora = localFont({
//   src: './fonts/Lora-Variable.ttf',
//   display: 'swap'
// })

// const openSans = localFont({
//   src: './fonts/OpenSans-Variable.ttf',
//   display: 'swap'
// })

export const metadata: Metadata = {
  title: 'rePlace',
  description:
    'Nextron ( Next.Js + Electron ) project boilerplate in TypeScript, with TailwindCSS + Shadcn/ui, web and desktop crossbuild'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body className={cn('bg-background font-sans antialiased')}>
        <Header />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
