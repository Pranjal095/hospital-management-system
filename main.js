const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require("path");

let mainWindow;
let backendProcess;

app.whenReady().then(() => {
    backendProcess = exec('node backend/server.js');

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, "frontend", "dist", "index.html"));

    mainWindow.on('closed', () => {
        if (backendProcess) backendProcess.kill();
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});
