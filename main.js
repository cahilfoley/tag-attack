const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    fullscreen: true,
    // width: 1920,
    // height: 1080,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  win.setMenu(null)
  win.setMenuBarVisibility(false)

  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
