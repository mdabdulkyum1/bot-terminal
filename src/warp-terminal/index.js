import readline from 'readline';
import chalk from 'chalk';
import { runAICommand } from '../core/aiProcessor.js';
import { addToContext, getContext } from '../core/contextManager.js';
import { logger } from '../utils/logger.js';
import { CommandBlock } from './commandBlock.js';
import { WarpUI } from './warpUI.js';
import { AutoComplete } from './autoComplete.js';
import { SessionManager } from './sessionManager.js';

class WarpTerminal {
  constructor() {
    this.rl = null;
    this.commandHistory = [];
    this.isAIProcessing = false;
    this.ui = new WarpUI();
    this.autoComplete = new AutoComplete();
    this.sessionManager = new SessionManager();
    this.currentPrompt = '';
  }

  async start() {
    await this.sessionManager.initialize();
    this.ui.showWelcome();
    this.setupReadline();
    this.showPrompt();
  }

  setupReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '',
      completer: (line) => this.autoComplete.complete(line),
    });

    this.rl.on('line', (input) => this.handleInput(input.trim()));
    this.rl.on('SIGINT', () => this.handleExit());
    this.rl.on('SIGTSTP', () => this.handleSuspend());
  }

  async handleInput(input) {
    if (!input) {
      this.showPrompt();
      return;
    }

    // Handle special commands
    if (input.startsWith('!')) {
      await this.handleSpecialCommand(input);
      return;
    }

    // Add to history
    this.commandHistory.push(input);
    
    // Create command block
    const block = new CommandBlock(input);
    this.sessionManager.addBlock(block);
    
    // Check if it's an AI command
    if (this.isAICommand(input)) {
      await this.handleAICommand(input, block);
    } else {
      await this.executeSystemCommand(input, block);
    }

    this.showPrompt();
  }

  isAICommand(input) {
    return input.startsWith('ai ') || 
           input.startsWith('?') || 
           input.startsWith('explain ') ||
           input.startsWith('edit ') ||
           input.startsWith('ask ');
  }

  async handleAICommand(input, block) {
    try {
      this.isAIProcessing = true;
      block.setStatus('processing');
      this.ui.showProcessing(block.id);

      let processedInput = input;
      
      // Handle different AI command formats
      if (input.startsWith('ai ')) {
        processedInput = input.slice(3);
      } else if (input.startsWith('?')) {
        processedInput = input.slice(1);
      }

      // Get context and build prompt
      const context = await getContext();
      const prompt = context ? `${context}\nUser: ${processedInput}` : processedInput;
      
      // Process with AI
      const response = await runAICommand('ask', prompt);
      
      // Update block with response
      block.setOutput(response);
      block.setStatus('completed');
      
      // Add to context
      await addToContext(`User: ${processedInput}\nAI: ${response}`);
      
      this.ui.showResult(block);
      
    } catch (error) {
      block.setError(error.message);
      block.setStatus('error');
      this.ui.showError(block);
      logger.error(`AI Command error: ${error.message}`);
    } finally {
      this.isAIProcessing = false;
    }
  }

  async executeSystemCommand(input, block) {
    try {
      block.setStatus('executing');
      this.ui.showExecuting(block.id);

      // Execute system command
      const { spawn } = await import('child_process');
      const [command, ...args] = input.split(' ');
      
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
        this.ui.showLiveOutput(block.id, data.toString());
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
        this.ui.showLiveError(block.id, data.toString());
      });

      child.on('close', (code) => {
        block.setOutput(output);
        block.setError(errorOutput);
        block.setExitCode(code);
        block.setStatus(code === 0 ? 'completed' : 'error');
        
        if (code === 0) {
          this.ui.showResult(block);
        } else {
          this.ui.showError(block);
        }
      });

    } catch (error) {
      block.setError(error.message);
      block.setStatus('error');
      this.ui.showError(block);
    }
  }

  async handleSpecialCommand(input) {
    const command = input.slice(1);
    
    switch (command) {
      case 'help':
        this.showHelp();
        break;
      case 'history':
        this.showHistory();
        break;
      case 'clear':
        this.clearScreen();
        break;
      case 'session':
        this.showSession();
        break;
      case 'stats':
        this.showStats();
        break;
      case 'sessions':
        this.listSessions();
        break;
      case 'ai-help':
        this.showAIHelp();
        break;
      default:
        this.ui.showError(`Unknown special command: ${command}`);
    }
    
    this.showPrompt();
  }

  showPrompt() {
    const timestamp = new Date().toLocaleTimeString();
    const workingDir = process.cwd().split('/').pop();
    const prompt = chalk.blue(`[${timestamp}] `) + 
                  chalk.green(`${workingDir} `) + 
                  chalk.yellow('❯ ');
    
    this.currentPrompt = prompt;
    this.rl.setPrompt(prompt);
    this.rl.prompt();
  }

  showHelp() {
    this.ui.showHelp();
  }

  showHistory() {
    this.ui.showHistory(this.commandHistory);
  }

  clearScreen() {
    console.clear();
    this.ui.showWelcome();
  }

  showSession() {
    this.ui.showSession(this.sessionManager.getBlocks());
  }

  showStats() {
    this.ui.showStats(this.sessionManager.getSessionStats());
  }

  async listSessions() {
    const sessions = await this.sessionManager.listSessions();
    this.ui.showSessionsList(sessions);
  }

  showAIHelp() {
    this.ui.showAIHelp();
  }

  handleExit() {
    console.log(chalk.yellow('\n👋 Goodbye!'));
    process.exit(0);
  }

  handleSuspend() {
    console.log(chalk.yellow('\n⏸️  Terminal suspended. Press Ctrl+C to exit.'));
  }
}

export { WarpTerminal };
