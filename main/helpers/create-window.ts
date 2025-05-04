import type { WindowState } from '@/types'
import type { BrowserWindowConstructorOptions, Rectangle } from 'electron'
import { screen, BrowserWindow, app } from 'electron'
import Store from 'electron-store'

export const createWindow = (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = 'window-state'
  const name = `window-state-${windowName}`
  const store = new Store<Rectangle>({ name })
  const defaultSize = {
    width: options.width,
    height: options.height
  }
  let state = {}

  const restore = () => {
    return {
      ...defaultSize,
      x: 0,
      y: 0,
      ...store.get(key, defaultSize)
    }
  }

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size = win.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    }
  }

  const windowWithinBounds = (
    windowState: WindowState,
    bounds: Electron.Rectangle
  ) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    })
  }

  const ensureVisibleOnSomeDisplay = (
    windowState: WindowState
  ): WindowState => {
    const visible = screen
      .getAllDisplays()
      .some((display: Electron.Display) => {
        return windowWithinBounds(windowState, display.bounds)
      })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  state = ensureVisibleOnSomeDisplay(restore())

  const win = new BrowserWindow({
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      ...options.webPreferences
    }
  })

  const isDev = !app.isPackaged

  const csp = [
    "default-src 'self'",
    `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' ws: http://localhost:*",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; ')

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
    })
  })

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
  }

  win.on('close', saveState)

  return win
}
