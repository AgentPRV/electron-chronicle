const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

autoUpdater.checkForUpdatesAndNotify()

var sqlite3 = require("sqlite3").verbose();

// Check if the app is packaged
const isPackaged = app.isPackaged;

// Get the current application directory
const appDirectory = isPackaged ? path.dirname(app.getAppPath()) : app.getAppPath();

// Construct the path to the notes.db file
const dbSource = path.join(appDirectory, 'db', 'notes.db');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.on("read-notes", (event) => {
    var db = new sqlite3.Database(dbSource);
    db.all("SELECT * from note", function(err, rows){
      win.webContents.send('render-notes-ui', rows)
    });
    db.close();
  });
  win.loadFile("index.html");
};

const runMigration = () => {
  var db = new sqlite3.Database(dbSource);
  db.serialize(() => {
    db.exec(
      "CREATE TABLE IF NOT EXISTS note ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT );"
    );
  });
  db.close();
}

ipcMain.on("insert-note", (event, title, description) => {
  var db = new sqlite3.Database(dbSource);
  db.serialize(() => {
    db.exec(
      "INSERT into note(title, description) VALUES('" +
        title +
        "','" +
        description +
        "')"
    );
  });
  db.close();
});

ipcMain.on("update-note", (event, id, title, description) => {
  var db = new sqlite3.Database(dbSource);
  db.serialize(() => {
    db.exec(
      "UPDATE note SET title='"+title+"', description='"+description+"' where id="+id
    );
  });
  db.close();
});

ipcMain.on("delete-note", (event, id) => {
  var db = new sqlite3.Database(dbSource);
  db.run("DELETE FROM note WHERE id = ?", id);
  db.close();
});

app.whenReady().then(() => {
  runMigration();
  createWindow();
});
