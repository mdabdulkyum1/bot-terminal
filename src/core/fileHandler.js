
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/logger.js';

export async function readFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, 'utf8');
    logger.info(`Read file: ${filePath}`);
    return content;
  } catch (error) {
    logger.error(`Error reading file ${filePath}: ${error.message}`);
    throw error;
  }
}

export async function writeFile(filePath, content) {
  try {
    const absolutePath = path.resolve(filePath);
    await fs.writeFile(absolutePath, content);
    logger.info(`Wrote to file: ${filePath}`);
  } catch (error) {
    logger.error(`Error writing to file ${filePath}: ${error.message}`);
    throw error;
  }
}
