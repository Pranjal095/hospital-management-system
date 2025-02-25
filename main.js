const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require("path");

let mainWindow;
let backendProcess;

// Determine the base path depending on your environment:
const basePath = app.isPackaged ? process.resourcesPath : __dirname;

app.whenReady().then(() => {
    // Construct the absolute path to the backend/server.js file (ensure backend is outside the asar or unpacked)
    const serverPath = path.join(basePath, "backend", "server.js");
    backendProcess = exec(`${process.execPath} --no-sandbox ${serverPath}`, { cwd: basePath }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error starting backend server:', error);
            return;
        }
        if (stderr) console.error('Backend server stderr:', stderr);
        console.log('Backend server stdout:', stdout);
    });

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