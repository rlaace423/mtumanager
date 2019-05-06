const path = require('path');
const { app, Tray, BrowserWindow } = require('electron');

app.dock.hide();

let tray = null;
let window = null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: true,
    frame: true,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      backgroundThrottling: false
    },
  });
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

  window.on('blur', () => {
      window.hide();
  });
};

app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  app.quit();
});

const createTray = () => {
  tray = new Tray(path.join(__dirname, 'assets', 'sunTemplate.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', toggleWindow);
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};