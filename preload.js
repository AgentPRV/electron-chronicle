const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  insertNote: (title, description) => ipcRenderer.send("insert-note", title, description),
  readNotes: () => ipcRenderer.send("read-notes"),
  updateNote: (id, title, description) => ipcRenderer.send("update-note", id, title, description),
  deleteNote: (id) => ipcRenderer.send("delete-note", id),
  renderNotesUI: (callback) => ipcRenderer.on('render-notes-ui', (_event, value) => callback(value)),
});