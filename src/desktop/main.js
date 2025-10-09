const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let mainWindow;
let botTerminalProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: parseInt(process.env.DESKTOP_WIDTH) || 1200,
    height: parseInt(process.env.DESKTOP_HEIGHT) || 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: process.env.DESKTOP_TITLE || 'Bot Terminal - AI Development Assistant',
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// IPC handlers for communication with renderer
ipcMain.handle('start-bot-terminal', async () => {
  try {
    const botPath = path.join(__dirname, '../bot-terminal/main.js');
    botTerminalProcess = spawn('node', [botPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    return { success: true, pid: botTerminalProcess.pid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-bot-terminal', async () => {
  if (botTerminalProcess) {
    botTerminalProcess.kill();
    botTerminalProcess = null;
    return { success: true };
  }
  return { success: false, error: 'No terminal process running' };
});

ipcMain.handle('get-project-info', async () => {
  try {
    // This would integrate with your project analyzer
    return {
      name: 'Bot Terminal Project',
      path: process.cwd(),
      type: 'Node.js',
      files: 0,
      lines: 0
    };
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('open-file-dialog', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Code Files', extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h'] },
        { name: 'Config Files', extensions: ['json', 'yaml', 'yml', 'xml'] },
        { name: 'Documentation', extensions: ['md', 'txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, filePath: result.filePaths[0] };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-folder-dialog', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, folderPath: result.filePaths[0] };
    }
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (botTerminalProcess) {
    botTerminalProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (botTerminalProcess) {
    botTerminalProcess.kill();
  }
});
