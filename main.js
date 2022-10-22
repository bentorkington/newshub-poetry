const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const parser = require('node-html-parser');
const NewsTile = require('./newstile');
const StoryCard = require('./nzh-story-card');

// better performance if we disable this unneeded feature
app.disableHardwareAcceleration();

const isMac = process.platform === 'darwin';

let offscreen;

Array.prototype.asyncFilter = async function(f){
  var array = this;
  var booleans = await Promise.all(array.map(f));
  return array.filter((x,i)=>booleans[i])
}

const fetchAndRender = () => {
  offscreen = new BrowserWindow({
    enableLargerThanScreen: true,
    width: 2000,
    height: 2000,
    show: isMac,
    webPreferences: {
      offscreen: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  if (isMac) {
    offscreen.hide();
  }

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
  offscreen.loadFile('poem.html')
    .then(() => fetch('https://www.nzherald.co.nz/'))
    .then((res) => res.text())
    .then((html) => {
      const doc = parser.parse(html);    
      const uniqueStories = NewsTile
        .uniqueByUrl(Array.from(doc.querySelectorAll('article.story-card[data-test-ui]:not([data-test-ui="story-card__blank-html"])'))
        
        .map(el => new StoryCard(el)))
        .filter(s => s.headlineQuotes);

      const now = Date.now();
      Promise.all(uniqueStories.map((story) => {
        return story.getArticlePublicationDate().then((date) => {
          return { story, age: (now - date) / (60 * 60 * 1000) };
        })
      })).then((agedStories) => {
        const freshStories = agedStories.filter(s => s.age <= 24).map(as => as.story);
        const headlines = freshStories
          .flatMap((hl) => hl.headlineQuotes)
          .filter((match) => match);

        const date = new Date();
        const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
        const fullDate = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
        offscreen.webContents.send('send-settings', { headlines, dayName, fullDate });
      });
    });
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
