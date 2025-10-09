#!/usr/bin/env node

import { WarpTerminal } from './index.js';
import { logger } from '../utils/logger.js';

async function main() {
  try {
    const terminal = new WarpTerminal();
    await terminal.start();
  } catch (error) {
    logger.error(`Failed to start Warp Terminal: ${error.message}`);
    console.error('❌ Failed to start terminal:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  console.error('❌ Unhandled rejection:', reason);
  process.exit(1);
});

main();
