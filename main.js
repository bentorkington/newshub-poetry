const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// better performance if we disable this unneeded feature
app.disableHardwareAcceleration();

let offscreen;

const fetchAndRender = () => {
  offscreen = new BrowserWindow({
    enableLargerThanScreen: true,
    width: 2000,
    height: 2000,
    webPreferences: {
      offscreen: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  offscreen.hide();
  ipcMain.handle('poem-rendered', (ev) => {
    console.log('rendered');
    offscreen.webContents.capturePage()
      .then((image) => {
        dialog.showSaveDialog({
          title: "Save PNG as…",
          defaultPath: `newshub-poem-${new Date().toISOString().replace(/T.*/,'')}.png`,
          properties: ["createDirectory"],
        }).then((dialogResult) => {
          if (!dialogResult.canceled) {
            console.log('writing to ' + dialogResult.filePath);
            fs.writeFileSync(dialogResult.filePath, image.toPNG());
            dialog.showMessageBoxSync({ message: `Saved PNG to ${dialogResult.filePath}` });
          }
          app.quit();
        });
      });
  });
  offscreen.loadFile('poem.html');
}

app.whenReady().then(() => {
  fetchAndRender();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
