import { readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

export class AutoComplete {
  constructor() {
    this.commonCommands = [
      'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'cat', 'grep',
      'find', 'ps', 'top', 'kill', 'git', 'npm', 'node', 'python', 'docker',
      'kubectl', 'aws', 'curl', 'wget', 'ssh', 'scp', 'tar', 'zip', 'unzip'
    ];
    
    this.aiCommands = [
      'ai', 'ask', 'explain', 'edit', 'help', 'summarize', 'translate', 'debug'
    ];
    
    this.gitCommands = [
      'add', 'commit', 'push', 'pull', 'branch', 'checkout', 'merge', 'status',
      'log', 'diff', 'reset', 'stash', 'tag', 'remote', 'fetch'
    ];
    
    this.npmCommands = [
      'install', 'uninstall', 'update', 'start', 'test', 'build', 'run', 'init',
      'publish', 'audit', 'outdated', 'list', 'search'
    ];
  }

  complete(line) {
    const tokens = line.trim().split(' ');
    const command = tokens[0];
    const lastToken = tokens[tokens.length - 1];

    // Handle AI commands
    if (command.startsWith('ai') || command.startsWith('?')) {
      return this.completeAICommand(line);
    }

    // Handle git commands
    if (command === 'git' && tokens.length === 2) {
      return this.completeGitCommand(lastToken);
    }

    // Handle npm commands
    if (command === 'npm' && tokens.length === 2) {
      return this.completeNpmCommand(lastToken);
    }

    // Handle file/directory completion
    if (lastToken && (lastToken.includes('/') || lastToken.startsWith('./') || lastToken.startsWith('../'))) {
      return this.completeFilePath(lastToken);
    }

    // Handle command completion
    if (tokens.length === 1) {
      return this.completeCommand(command);
    }

    return [[], line];
  }

  completeCommand(command) {
    const matches = [...this.commonCommands, ...this.aiCommands]
      .filter(cmd => cmd.startsWith(command.toLowerCase()))
      .sort();

    return [matches, command];
  }

  completeAICommand(line) {
    const suggestions = [
      'ai help',
      'ai explain JavaScript async/await',
      'ai how to use git',
      'ai debug this code',
      'ai optimize performance',
      'ai translate to English',
      'ai summarize this text',
      'ai write a function to',
      'ai best practices for',
      'ai what is the difference between'
    ];

    const matches = suggestions.filter(suggestion => 
      suggestion.toLowerCase().startsWith(line.toLowerCase())
    );

    return [matches, line];
  }

  completeGitCommand(command) {
    const matches = this.gitCommands.filter(cmd => 
      cmd.startsWith(command.toLowerCase())
    );

    return [matches, command];
  }

  completeNpmCommand(command) {
    const matches = this.npmCommands.filter(cmd => 
      cmd.startsWith(command.toLowerCase())
    );

    return [matches, command];
  }

  completeFilePath(path) {
    try {
      const dir = dirname(path);
      const base = basename(path);
      const fullDir = dir === '.' ? process.cwd() : join(process.cwd(), dir);
      
      const files = readdirSync(fullDir);
      const matches = files
        .filter(file => file.startsWith(base))
        .map(file => {
          const fullPath = join(dir, file);
          try {
            const stat = statSync(join(fullDir, file));
            return stat.isDirectory() ? fullPath + '/' : fullPath;
          } catch {
            return fullPath;
          }
        });

      return [matches, path];
    } catch (error) {
      return [[], path];
    }
  }

  getSuggestions(line) {
    const [matches] = this.complete(line);
    return matches.slice(0, 10); // Limit to 10 suggestions
  }

  // Smart suggestions based on context
  getSmartSuggestions(line, history = []) {
    const suggestions = [];

    // Add common next commands based on history
    if (history.length > 0) {
      const lastCommand = history[history.length - 1];
      
      if (lastCommand.includes('git')) {
        suggestions.push('git status', 'git log --oneline', 'git diff');
      }
      
      if (lastCommand.includes('npm')) {
        suggestions.push('npm start', 'npm test', 'npm run build');
      }
      
      if (lastCommand.includes('ls')) {
        suggestions.push('cd ', 'cat ', 'mkdir ');
      }
    }

    // Add AI suggestions
    if (line.length > 2) {
      suggestions.push(
        `ai explain ${line}`,
        `ai how to use ${line}`,
        `ai best practices for ${line}`
      );
    }

    return suggestions.slice(0, 5);
  }
}
