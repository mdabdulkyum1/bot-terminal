
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { askCommand, editCommand, explainCommand } from './commands.js';
import { loadSettings } from '../config/settings.js';
import { initializeContext } from '../core/contextManager.js';
import { logger } from '../utils/logger.js';

// Initialize settings and context
const settings = loadSettings();
await initializeContext();

console.log(chalk.green('🤖 Welcome to AI Terminal CLI!'));

while (true) {
  const input = readlineSync.question(chalk.blue('> Enter command (ask/edit/explain/exit): ')).trim();
  
  if (input === 'exit') {
    console.log(chalk.yellow('Goodbye!'));
    break;
  }

  try {
    if (input.startsWith('ask ')) {
      const query = input.slice(4);
      const response = await askCommand(query, settings);
      console.log(chalk.cyan(response));
    } else if (input.startsWith('edit ')) {
      const filePath = input.slice(5);
      const result = await editCommand(filePath, settings);
      console.log(chalk.green(result));
    } else if (input.startsWith('explain ')) {
      const topic = input.slice(8);
      const explanation = await explainCommand(topic, settings);
      console.log(chalk.cyan(explanation));
    } else {
      console.log(chalk.red('Invalid command. Use ask, edit, explain, or exit.'));
    }
  } catch (error) {
    logger.error(`Error processing command: ${error.message}`);
    console.log(chalk.red(`Error: ${error.message}`));
  }
}
