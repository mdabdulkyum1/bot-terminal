import chalk from 'chalk';
import figlet from 'figlet';
import { promisify } from 'util';

const figletAsync = promisify(figlet);

export class BotUI {
  constructor() {
    this.blockCounter = 0;
    this.isInitialized = false;
  }

  async showWelcome() {
    if (!this.isInitialized) {
      try {
        const title = await figletAsync('BOT TERMINAL');
        console.log(chalk.cyan(title));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.log(chalk.yellow('🤖 AI-Powered Development Assistant'));
        console.log(chalk.gray('   Full project analysis • Smart file editing • Multi-AI support'));
        console.log(chalk.gray('   Type ') + chalk.cyan('!help') + chalk.gray(' for commands, ') + chalk.cyan('!ai-help') + chalk.gray(' for AI features'));
        console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
        this.isInitialized = true;
      } catch (error) {
        console.log(chalk.cyan('🤖 BOT TERMINAL'));
        console.log(chalk.yellow('🚀 AI-Powered Development Assistant\n'));
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
    process.stdout.write(chalk.white(data));
  }

  showLiveError(blockId, data) {
    process.stderr.write(chalk.red(data));
  }

  showHelp() {
    console.log(chalk.cyan('\n📚 BOT TERMINAL HELP'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Special Commands:'));
    console.log(chalk.white('  !help          ') + chalk.gray('Show this help message'));
    console.log(chalk.white('  !history       ') + chalk.gray('Show command history'));
    console.log(chalk.white('  !clear         ') + chalk.gray('Clear the terminal screen'));
    console.log(chalk.white('  !session       ') + chalk.gray('Show current session blocks'));
    console.log(chalk.white('  !stats         ') + chalk.gray('Show session statistics'));
    console.log(chalk.white('  !sessions      ') + chalk.gray('List all saved sessions'));
    console.log(chalk.white('  !ai-info       ') + chalk.gray('Show AI provider information'));
    console.log(chalk.white('  !project-info  ') + chalk.gray('Show project analysis'));
    console.log(chalk.white('  !ai-help       ') + chalk.gray('Show AI command help'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('AI Commands:'));
    console.log(chalk.white('  ai <question>     ') + chalk.gray('Ask AI any question'));
    console.log(chalk.white('  ?<question>       ') + chalk.gray('Quick AI question'));
    console.log(chalk.white('  ask <question>    ') + chalk.gray('Explicit ask command'));
    console.log(chalk.white('  explain <topic>   ') + chalk.gray('Get detailed explanation'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Project Commands:'));
    console.log(chalk.white('  analyze           ') + chalk.gray('Analyze entire project'));
    console.log(chalk.white('  summary           ') + chalk.gray('Show project summary'));
    console.log(chalk.white('  read <file>       ') + chalk.gray('Read and display file'));
    console.log(chalk.white('  edit <file>       ') + chalk.gray('AI-assisted file editing'));
    console.log(chalk.white('  project <query>   ') + chalk.gray('Ask about project'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('System Commands:'));
    console.log(chalk.white('  Any system command works normally (ls, cd, git, npm, etc.)'));
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
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Project Analysis Commands:'));
    console.log(chalk.white('  analyze           ') + chalk.gray('Full project analysis with AI'));
    console.log(chalk.white('  summary           ') + chalk.gray('Quick project overview'));
    console.log(chalk.white('  read <file>       ') + chalk.gray('Read any file in project'));
    console.log(chalk.white('  edit <file>       ') + chalk.gray('AI edit with permission system'));
    console.log(chalk.white('  project <query>   ') + chalk.gray('Ask AI about your project'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.yellow('Examples:'));
    console.log(chalk.white('  ai How do I optimize React performance?'));
    console.log(chalk.white('  ?What is async/await in JavaScript?'));
    console.log(chalk.white('  explain Docker containers'));
    console.log(chalk.white('  analyze'));
    console.log(chalk.white('  read src/App.js'));
    console.log(chalk.white('  edit package.json'));
    console.log(chalk.white('  project What technologies am I using?'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showAIInfo(info) {
    console.log(chalk.cyan('\n🤖 AI PROVIDER INFORMATION'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white('  Provider: ') + chalk.blue(info.provider.toUpperCase()));
    console.log(chalk.white('  Model: ') + chalk.green(info.model));
    console.log(chalk.white('  Max Tokens: ') + chalk.yellow(info.maxTokens.toLocaleString()));
    console.log(chalk.white('  Max File Size: ') + chalk.yellow((info.maxFileSize / 1024).toFixed(1) + ' KB'));
    console.log(chalk.white('  Allowed Extensions: ') + chalk.gray(info.allowedExtensions.join(', ')));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }

  showProjectInfo(analysis) {
    console.log(chalk.cyan('\n📊 PROJECT INFORMATION'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white('  Project: ') + chalk.blue(analysis.packageInfo?.name || 'Unknown'));
    console.log(chalk.white('  Version: ') + chalk.green(analysis.packageInfo?.version || 'N/A'));
    console.log(chalk.white('  Type: ') + chalk.yellow(analysis.packageInfo?.type || 'CommonJS'));
    console.log(chalk.white('  Files: ') + chalk.cyan(analysis.structure.totalFiles.toLocaleString()));
    console.log(chalk.white('  Directories: ') + chalk.cyan(analysis.structure.totalDirectories.toLocaleString()));
    console.log(chalk.white('  Lines of Code: ') + chalk.cyan(analysis.codeStats.totalLines.toLocaleString()));
    console.log(chalk.white('  Total Size: ') + chalk.cyan((analysis.codeStats.totalSize / 1024 / 1024).toFixed(2) + ' MB'));
    
    console.log(chalk.gray('\n  Top File Types:'));
    Object.entries(analysis.codeStats.filesByExtension)
      .sort((a, b) => b[1].lines - a[1].lines)
      .slice(0, 5)
      .forEach(([ext, stats]) => {
        console.log(chalk.gray(`    ${ext}: `) + chalk.white(`${stats.count} files, ${stats.lines} lines`));
      });
    
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
        
        const type = block.isAICommand ? chalk.cyan('🤖') : 
                    block.input?.startsWith('analyze') || block.input?.startsWith('edit') ? chalk.magenta('📁') :
                    chalk.gray('⚙️');
        
        console.log(chalk.white(`  ${index + 1}. `) + status + type + chalk.gray(` ${block.input}`));
      });
    }
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
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
}
