const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

const indexPath = path.join(__dirname, "frontend", "dist", "index.html");

function createWindow() {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    console.log("Loading frontend from:", indexPath);
    mainWindow.loadFile(indexPath);

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
