const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('bridge', {
  poemRendered: (a) => ipcRenderer.invoke('poem-rendered', a),
  sendSettings: (message) => ipcRenderer.on('send-settings', message),
});

