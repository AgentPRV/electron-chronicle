const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose();
const { autoUpdater } = require("electron-updater")
autoUpdater.checkForUpdatesAndNotify()

const isPackaged = app.isPackaged;

const appPath =  isPackaged ? path.dirname(app.getAppPath()) : app.getAppPath()
const dbFile = path.join(appPath, 'db', 'notes.db')

function runMigration() {
  const db = new sqlite3.Database(dbFile);

  db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title text, description text)");
  });

  db.close();
}


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    ipcMain.on('fetch-notes', (event) => {
      const db = new sqlite3.Database(dbFile);
  
  
      db.all("SELECT * from notes", function(err, rows) {
        // handle error
        win.webContents.send('read-notes-ui', rows)
        
      });
  
    db.close();
    })
  
    win.loadFile('index.html')
  }


  ipcMain.on('create-notes', (event, title, description) => {
    const db = new sqlite3.Database(dbFile);

  db.serialize(() => {
      db.exec("INSERT INTO notes(title, description) values('"+title+"', '"+description+"')");
  });

  db.close();
  })

  ipcMain.on('update-notes', (event, id, title, description) => {
    const db = new sqlite3.Database(dbFile);

  db.serialize(() => {
      db.exec("UPDATE notes SET title='"+title+"',description='"+description+"' WHERE id="+id);
  });

  db.close();
  })

  ipcMain.on('delete-notes', (event, id) => {
    const db = new sqlite3.Database(dbFile);

  db.serialize(() => {
      db.exec("DELETE from notes WHERE id="+id);
  });

  db.close();
  })


  app.whenReady().then(() => {
    runMigration()
    createWindow()
  })