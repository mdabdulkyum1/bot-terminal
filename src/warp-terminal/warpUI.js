import chalk from 'chalk';
import figlet from 'figlet';
import { promisify } from 'util';

const figletAsync = promisify(figlet);

export class WarpUI {
  constructor() {
    this.blockCounter = 0;
    this.isInitialized = false;
  }

  async showWelcome() {
    if (!this.isInitialized) {
      try {
        const title = await figletAsync('WARP AI');
        console.log(chalk.cyan(title));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.yellow('🚀 AI-Powered Terminal Assistant'));
        console.log(chalk.gray('   Type ') + chalk.cyan('!help') + chalk.gray(' for commands, ') + chalk.cyan('!ai-help') + chalk.gray(' for AI features'));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        this.isInitialized = true;
      } catch (error) {
        console.log(chalk.cyan('🤖 WARP AI TERMINAL'));
        console.log(chalk.yellow('🚀 AI-Powered Terminal Assistant\n'));
      }
    }
  }

  showProcessing(blockId) {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'][Math.floor(Date.now() / 100) % 10];
    process.stdout.write(`\r${chalk.blue(spinner)} ${chalk.gray('AI processing...')}`);
  }

  showExecuting(blockId) {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'][Math.floor(Date.now() / 100) % 10];
    process.stdout.write(`\r${chalk.yellow(spinner)} ${chalk.gray('Executing...')}`);
  }

  showResult(block) {
    console.log(); // New line after spinner
    console.log(chalk.gray('┌─────────────────────────────────────────────────────────────────────────────┐'));
    console.log(chalk.gray('│ ') + chalk.green('✓ Command completed successfully'));
    console.log(chalk.gray('├─────────────────────────────────────────────────────────────────────────────┤'));
    
    if (block.input) {
      console.log(chalk.gray('│ ') + chalk.blue('Input: ') + chalk.white(block.input));
      console.log(chalk.gray('├─────────────────────────────────────────────────────────────────────────────┤'));
    }
    
    if (block.output) {
      const lines = block.output.split('\n');
      lines.forEach(line => {
        console.log(chalk.gray('│ ') + chalk.white(line));
      });
    }
    
    console.log(chalk.gray('└─────────────────────────────────────────────────────────────────────────────┘\n'));
  }

  showError(block) {
    console.log(); // New line after spinner
    console.log(chalk.gray('┌─────────────────────────────────────────────────────────────────────────────┐'));
    console.log(chalk.gray('│ ') + chalk.red('✗ Command failed'));
    console.log(chalk.gray('├─────────────────────────────────────────────────────────────────────────────┤'));
    
    if (block.input) {
      console.log(chalk.gray('│ ') + chalk.blue('Input: ') + chalk.white(block.input));
      console.log(chalk.gray('├─────────────────────────────────────────────────────────────────────────────┤'));
    }
    
    if (block.error) {
      const lines = block.error.split('\n');
      lines.forEach(line => {
        console.log(chalk.gray('│ ') + chalk.red(line));
      });
    }
    
    if (block.exitCode !== undefined) {
      console.log(chalk.gray('│ ') + chalk.red(`Exit code: ${block.exitCode}`));
    }
    
    console.log(chalk.gray('└─────────────────────────────────────────────────────────────────────────────┘\n'));
  }

  showLiveOutput(blockId, data) {
    // For live output, we'll just show it directly
    process.stdout.write(chalk.white(data));
  }

  showLiveError(blockId, data) {
    process.stderr.write(chalk.red(data));
  }

  showHelp() {
    console.log(chalk.cyan('\n📚 WARP TERMINAL HELP'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Special Commands:'));
    console.log(chalk.white('  !help        ') + chalk.gray('Show this help message'));
    console.log(chalk.white('  !history     ') + chalk.gray('Show command history'));
    console.log(chalk.white('  !clear       ') + chalk.gray('Clear the terminal screen'));
    console.log(chalk.white('  !session     ') + chalk.gray('Show current session blocks'));
    console.log(chalk.white('  !stats       ') + chalk.gray('Show session statistics'));
    console.log(chalk.white('  !sessions    ') + chalk.gray('List all saved sessions'));
    console.log(chalk.white('  !ai-help     ') + chalk.gray('Show AI command help'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Regular Commands:'));
    console.log(chalk.white('  Any system command works normally (ls, cd, git, etc.)'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showAIHelp() {
    console.log(chalk.cyan('\n🤖 AI COMMANDS HELP'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('AI Command Formats:'));
    console.log(chalk.white('  ai <question>     ') + chalk.gray('Ask AI any question'));
    console.log(chalk.white('  ?<question>       ') + chalk.gray('Quick AI question (shortcut)'));
    console.log(chalk.white('  ask <question>    ') + chalk.gray('Explicit ask command'));
    console.log(chalk.white('  explain <topic>   ') + chalk.gray('Get detailed explanation'));
    console.log(chalk.white('  edit <file>       ') + chalk.gray('AI-assisted file editing'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Examples:'));
    console.log(chalk.white('  ai How do I use git?'));
    console.log(chalk.white('  ?What is async/await in JavaScript?'));
    console.log(chalk.white('  explain Docker containers'));
    console.log(chalk.white('  edit src/main.js'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showHistory(history) {
    console.log(chalk.cyan('\n📜 COMMAND HISTORY'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    if (history.length === 0) {
      console.log(chalk.gray('  No commands in history yet.'));
    } else {
      history.slice(-20).forEach((cmd, index) => {
        const num = history.length - 20 + index + 1;
        console.log(chalk.white(`  ${num.toString().padStart(3)}: `) + chalk.gray(cmd));
      });
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showSession(session) {
    console.log(chalk.cyan('\n📋 CURRENT SESSION'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    if (session.length === 0) {
      console.log(chalk.gray('  No commands in current session.'));
    } else {
      session.forEach((block, index) => {
        const status = block.status === 'completed' ? chalk.green('✓') :
                      block.status === 'error' ? chalk.red('✗') :
                      block.status === 'processing' ? chalk.blue('⏳') :
                      chalk.yellow('⏸');
        
        console.log(chalk.white(`  ${index + 1}. `) + status + chalk.gray(` ${block.input}`));
      });
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showError(message) {
    console.log(chalk.red(`❌ Error: ${message}`));
  }

  showSuccess(message) {
    console.log(chalk.green(`✅ ${message}`));
  }

  showInfo(message) {
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  showWarning(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  showStats(stats) {
    console.log(chalk.cyan('\n📊 SESSION STATISTICS'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white('  Session ID: ') + chalk.gray(stats.sessionId));
    console.log(chalk.white('  Total Blocks: ') + chalk.blue(stats.totalBlocks));
    console.log(chalk.white('  AI Commands: ') + chalk.green(stats.aiBlocks));
    console.log(chalk.white('  System Commands: ') + chalk.yellow(stats.systemBlocks));
    console.log(chalk.white('  Errors: ') + chalk.red(stats.errorBlocks));
    console.log(chalk.white('  Success Rate: ') + chalk.green(`${stats.successRate}%`));
    console.log(chalk.white('  Total Duration: ') + chalk.blue(stats.totalDuration));
    console.log(chalk.white('  Avg Block Duration: ') + chalk.blue(stats.avgBlockDuration));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showSessionsList(sessions) {
    console.log(chalk.cyan('\n📚 SAVED SESSIONS'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    if (sessions.length === 0) {
      console.log(chalk.gray('  No saved sessions found.'));
    } else {
      sessions.forEach((session, index) => {
        const date = new Date(session.lastSaved).toLocaleString();
        const status = index === 0 ? chalk.green('(current)') : '';
        console.log(chalk.white(`  ${index + 1}. `) + chalk.blue(session.id) + chalk.gray(` - ${session.blockCount} blocks - ${date} ${status}`));
      });
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }
}
