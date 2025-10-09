
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, '../../data/logs/session.log');

async function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  try {
    await fs.appendFile(LOG_FILE, logMessage);
  } catch (error) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

export const logger = {
  info: (message) => log('info', message),
  error: (message) => log('error', message),
};
