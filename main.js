const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    transparent: true,
    frame: false, // This will create a frameless window
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${path.join(__dirname, 'src', 'index.html')}`);

  // Inject custom CSS to hide the scrollbar
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      body {
        overflow: hidden;
      }
    `);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const iconPath = path.join(__dirname, 'src/res/icon.ico');
  const appIcon = nativeImage.createFromPath(iconPath);
  mainWindow.setIcon(appIcon); // For Windows and Linux
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

