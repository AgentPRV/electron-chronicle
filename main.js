const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

async function handleCallAPI () {
  const res = await fetch('https://dummyjson.com/products/1')
  const data = await res.json()
  return JSON.stringify(data)
}

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    ipcMain.on('set-title', (event, title) => {
      const webContents = event.sender
      const win = BrowserWindow.fromWebContents(webContents)
      win.setTitle(title)
    })

    ipcMain.handle('call-api', handleCallAPI)
  
    win.loadFile('index.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })