
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_FILE = path.join(__dirname, '../../data/memory.json');

export async function initializeContext() {
  try {
    await fs.ensureFile(MEMORY_FILE);
    await fs.writeJson(MEMORY_FILE, { context: [] }, { spaces: 2 });
    logger.info('Initialized empty context in memory.json');
  } catch (error) {
    logger.error(`Error initializing context: ${error.message}`);
    throw error;
  }
}

export async function addToContext(entry) {
  try {
    const memory = await fs.readJson(MEMORY_FILE);
    memory.context.push(entry);
    await fs.writeJson(MEMORY_FILE, memory, { spaces: 2 });
    logger.info('Context updated');
  } catch (error) {
    logger.error(`Error adding to context: ${error.message}`);
    throw error;
  }
}

export async function getContext() {
  try {
    const memory = await fs.readJson(MEMORY_FILE);
    return memory.context.join('\n');
  } catch (error) {
    logger.error(`Error reading context: ${error.message}`);
    throw error;
  }
}
