import { app, BrowserWindow, Tray, nativeImage, shell, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { initDB } from './db'

let tray: Tray | null = null
let popupWindow: BrowserWindow | null = null

function getIconPath(): string {
  // Use a template image for macOS menubar (16x16 or 18x18)
  return join(__dirname, '../../resources/trayIconTemplate.png')
}

function createPopupWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 380,
    height: 500,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: false,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  win.on('blur', () => {
    if (win && !win.isDestroyed()) {
      win.hide()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

function positionWindowAtTray(win: BrowserWindow): void {
  if (!tray) return

  const trayBounds = tray.getBounds()
  const windowSize = win.getSize()

  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowSize[0] / 2)
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  win.setPosition(x, y)
}

function togglePopup(): void {
  if (!popupWindow) {
    popupWindow = createPopupWindow()
  }

  if (popupWindow.isVisible()) {
    popupWindow.hide()
  } else {
    positionWindowAtTray(popupWindow)
    popupWindow.show()
    popupWindow.focus()
  }
}

app.whenReady().then(() => {
  // Init database
  try {
    initDB()
    console.log('Database initialized')
  } catch (err) {
    console.error('DB init error:', err)
  }

  // Create tray icon
  let icon: Electron.NativeImage

  try {
    icon = nativeImage.createFromPath(getIconPath())
    if (icon.isEmpty()) {
      // Fallback: create a simple 16x16 icon programmatically
      icon = nativeImage.createEmpty()
    }
  } catch {
    icon = nativeImage.createEmpty()
  }

  // On macOS, set as template for auto dark/light mode adaptation
  icon.setTemplateImage(true)

  tray = new Tray(icon)
  tray.setToolTip('Relay — Meeting Intelligence')

  tray.on('click', () => {
    togglePopup()
  })

  // IPC handlers
  ipcMain.handle('open-external', async (_event, url: string) => {
    await shell.openExternal(url)
  })

  ipcMain.handle('close-popup', () => {
    if (popupWindow) popupWindow.hide()
  })
})

app.on('window-all-closed', () => {
  // Keep running as a tray app even when all windows are closed
  // Don't quit on macOS
})

app.on('before-quit', () => {
  if (popupWindow) {
    popupWindow.removeAllListeners('blur')
    popupWindow.destroy()
  }
})
