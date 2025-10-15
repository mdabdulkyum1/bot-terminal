import readline from 'readline';
import chalk from 'chalk';
import { AIProvider } from '../core/aiProvider.js';
import { ProjectAnalyzer } from '../core/projectAnalyzer.js';
import { PermissionManager } from '../core/permissionManager.js';
import { addToContext, getContext } from '../core/contextManager.js';
import { logger } from '../utils/logger.js';
import { CommandBlock } from './commandBlock.js';
import { BotUI } from './botUI.js';
import { AutoComplete } from './autoComplete.js';
import { SessionManager } from './sessionManager.js';

class BotTerminal {
  constructor() {
    this.rl = null;
    this.commandHistory = [];
    this.isAIProcessing = false;
    this.ui = new BotUI();
    this.autoComplete = new AutoComplete();
    this.sessionManager = new SessionManager();
    this.aiProvider = new AIProvider();
    this.projectAnalyzer = new ProjectAnalyzer();
    this.permissionManager = new PermissionManager();
    this.projectAnalysis = null;
    this.currentPrompt = '';
  }

  async start() {
    await this.sessionManager.initialize();
    await this.initializeProject();
    this.ui.showWelcome();
    this.setupReadline();
    this.showPrompt();
  }

  async initializeProject() {
    try {
      logger.info('🔍 Initializing project analysis...');
      this.projectAnalysis = await this.projectAnalyzer.analyzeProject();
      logger.info('✅ Project analysis completed');
    } catch (error) {
      logger.error(`Project initialization failed: ${error.message}`);
      this.ui.showWarning('Project analysis failed. Some features may be limited.');
    }
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
    
    // Check command type
    if (this.isAICommand(input)) {
      await this.handleAICommand(input, block);
    } else if (this.isProjectCommand(input)) {
      await this.handleProjectCommand(input, block);
    } else {
      await this.executeSystemCommand(input, block);
    }

    this.showPrompt();
  }

  isAICommand(input) {
    return input.startsWith('ai ') || 
           input.startsWith('?') || 
           input.startsWith('explain ') ||
           input.startsWith('ask ');
  }

  isProjectCommand(input) {
    return input.startsWith('analyze ') ||
           input.startsWith('summary ') ||
           input.startsWith('edit ') ||
           input.startsWith('read ') ||
           input.startsWith('project ');
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
      } else if (input.startsWith('ask ')) {
        processedInput = input.slice(4);
      }

      // Get context and build prompt
      const context = await getContext();
      const prompt = context ? `${context}\nUser: ${processedInput}` : processedInput;
      
      // Process with AI
      const response = await this.aiProvider.generateResponse(prompt);

      logger.info('✅ response >>> :-', response);
      
      // Update block with response
      block.setOutput(response);
      block.setStatus('completed');
      
      // Add to context
      await addToContext(`User: ${processedInput}\nAI: ${response}`);
      
      this.ui.showResult(block);
      
    } catch (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error occurred';
      block.setError(errorMessage);
      block.setStatus('error');
      this.ui.showError(block);
      logger.error(`AI Command error: ${errorMessage}`);
    } finally {
      this.isAIProcessing = false;
    }
  }

  async handleProjectCommand(input, block) {
    try {
      block.setStatus('processing');
      this.ui.showProcessing(block.id);

      const parts = input.split(' ');
      const command = parts[0];
      const target = parts.slice(1).join(' ');

      let response = '';

      switch (command) {
        case 'analyze':
          if (!this.projectAnalysis) {
            this.projectAnalysis = await this.projectAnalyzer.analyzeProject();
          }
          response = this.projectAnalysis.summary;
          break;

        case 'summary':
          if (!this.projectAnalysis) {
            this.projectAnalysis = await this.projectAnalyzer.analyzeProject();
          }
          response = this.formatProjectSummary(this.projectAnalysis);
          break;

        case 'read':
          if (!target) {
            throw new Error('Please specify a file to read');
          }
          const fileData = await this.projectAnalyzer.readFile(target);
          response = `📁 File: ${fileData.path}\n📊 Size: ${fileData.size} chars, ${fileData.lines} lines\n\n${fileData.content}`;
          break;

        case 'edit':
          if (!target) {
            throw new Error('Please specify a file to edit');
          }
          response = await this.handleFileEdit(target, input);
          break;

        case 'project':
          response = await this.handleProjectQuery(target);
          break;

        default:
          throw new Error(`Unknown project command: ${command}`);
      }

      block.setOutput(response);
      block.setStatus('completed');
      this.ui.showResult(block);

    } catch (error) {
      const errorMessage = error.message || error.toString() || 'Unknown error occurred';
      block.setError(errorMessage);
      block.setStatus('error');
      this.ui.showError(block);
      logger.error(`Project Command error: ${errorMessage}`);
    }
  }

  async handleFileEdit(filePath, originalCommand) {
    try {
      // Read current file
      const currentFile = await this.projectAnalyzer.readFile(filePath);
      
      // Ask AI to edit the file
      const editPrompt = `Edit this file based on the user's request: "${originalCommand}"

Current file content:
${currentFile.content}

Please provide the complete edited file content. Only return the file content, no explanations.`;

      const editedContent = await this.aiProvider.generateResponse(editPrompt);
      
      // Check if we're in demo mode
      if (this.aiProvider.config.apiKey === 'demo_key') {
        return `🎭 Demo Mode: File editing is simulated. To enable real AI file editing, add your API key to the .env file.\n\nRequest: ${originalCommand}\nFile: ${filePath}`;
      }
      
      // Request permission
      const permission = await this.permissionManager.requestFileEditPermission(
        filePath,
        editedContent,
        {
          currentContent: currentFile.content,
          reason: `AI edit requested: ${originalCommand}`,
          diff: this.calculateDiff(currentFile.content, editedContent)
        }
      );

      if (permission.approved) {
        await this.projectAnalyzer.writeFile(filePath, editedContent);
        return `✅ File ${filePath} has been successfully updated with AI suggestions.`;
      } else {
        return `❌ File edit was not approved. No changes made to ${filePath}.`;
      }

    } catch (error) {
      throw new Error(`File edit failed: ${error.message}`);
    }
  }

  async handleProjectQuery(query) {
    if (!query) {
      return this.formatProjectSummary(this.projectAnalysis);
    }

    const prompt = `Based on this project analysis, answer the user's question: "${query}"

Project Analysis:
${JSON.stringify(this.projectAnalysis, null, 2)}

Please provide a helpful answer about the project.`;

    return await this.aiProvider.generateResponse(prompt);
  }

  calculateDiff(oldContent, newContent) {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    return {
      additions: newLines.length - oldLines.length,
      deletions: oldLines.length - newLines.length,
      changes: Math.abs(newLines.length - oldLines.length)
    };
  }

  formatProjectSummary(analysis) {
    if (!analysis) return 'No project analysis available.';

    return `
📊 PROJECT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Project: ${analysis.packageInfo?.name || 'Unknown'}
📦 Version: ${analysis.packageInfo?.version || 'N/A'}
📝 Description: ${analysis.packageInfo?.description || 'No description'}

📈 STATISTICS:
• Total Files: ${analysis.structure.totalFiles}
• Total Directories: ${analysis.structure.totalDirectories}
• Total Lines of Code: ${analysis.codeStats.totalLines.toLocaleString()}
• Total Size: ${(analysis.codeStats.totalSize / 1024 / 1024).toFixed(2)} MB

🔧 TECHNOLOGIES:
${Object.entries(analysis.codeStats.filesByExtension)
  .sort((a, b) => b[1].lines - a[1].lines)
  .slice(0, 10)
  .map(([ext, stats]) => `• ${ext}: ${stats.count} files, ${stats.lines} lines`)
  .join('\n')}

📋 AI ANALYSIS:
${analysis.summary}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
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
      case 'ai-info':
        this.showAIInfo();
        break;
      case 'project-info':
        this.showProjectInfo();
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
    const aiProvider = this.aiProvider.getProviderInfo().provider;
    const prompt = chalk.blue(`[${timestamp}] `) + 
                  chalk.green(`${workingDir} `) + 
                  chalk.cyan(`(${aiProvider}) `) +
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

  showAIInfo() {
    const info = this.aiProvider.getProviderInfo();
    this.ui.showAIInfo(info);
  }

  showProjectInfo() {
    if (this.projectAnalysis) {
      this.ui.showProjectInfo(this.projectAnalysis);
    } else {
      this.ui.showWarning('No project analysis available. Run project analysis first.');
    }
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

export { BotTerminal };
