
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadSettings() {
  const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  if (result.error) {
    logger.error(`Failed to load .env file: ${result.error.message}`);
    throw result.error;
  }

  const settings = {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(process.env.MAX_TOKENS, 10) || 1000,
  };

  if (!settings.openaiApiKey) {
    logger.error('OPENAI_API_KEY is not set in .env file');
    throw new Error('OPENAI_API_KEY is required');
  }

  return settings;
}
