import readline from 'readline';
import chalk from 'chalk';
import { logger } from '../utils/logger.js';

export class PermissionManager {
  constructor() {
    this.pendingChanges = new Map();
  }

  async requestFileEditPermission(filePath, changes, context = {}) {
    const changeId = this.generateChangeId();
    
    this.pendingChanges.set(changeId, {
      filePath,
      changes,
      context,
      timestamp: Date.now(),
      status: 'pending'
    });

    return await this.showEditPreview(changeId);
  }

  generateChangeId() {
    return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async showEditPreview(changeId) {
    const change = this.pendingChanges.get(changeId);
    if (!change) {
      throw new Error('Change request not found');
    }

    console.log(chalk.cyan('\n🔒 FILE EDIT PERMISSION REQUEST'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    console.log(chalk.white('📁 File: ') + chalk.yellow(change.filePath));
    console.log(chalk.white('📝 Context: ') + chalk.gray(change.context.reason || 'AI suggested edit'));
    
    if (change.context.currentContent) {
      console.log(chalk.gray('\n📖 CURRENT FILE PREVIEW:'));
      console.log(chalk.gray('┌─────────────────────────────────────────────────────────────────────────────┐'));
      const preview = this.previewContent(change.context.currentContent, 10);
      preview.forEach(line => {
        console.log(chalk.gray('│ ') + chalk.white(line));
      });
      console.log(chalk.gray('└─────────────────────────────────────────────────────────────────────────────┘'));
    }

    console.log(chalk.gray('\n🔄 PROPOSED CHANGES:'));
    console.log(chalk.gray('┌─────────────────────────────────────────────────────────────────────────────┐'));
    const changePreview = this.previewContent(change.changes, 15);
    changePreview.forEach(line => {
      console.log(chalk.gray('│ ') + chalk.green(line));
    });
    console.log(chalk.gray('└─────────────────────────────────────────────────────────────────────────────┘'));

    if (change.context.diff) {
      console.log(chalk.gray('\n📊 DIFF SUMMARY:'));
      console.log(chalk.green(`+ ${change.context.diff.additions} additions`));
      console.log(chalk.red(`- ${change.context.diff.deletions} deletions`));
    }

    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    const response = await this.askPermission();
    
    if (response === 'accept') {
      this.pendingChanges.set(changeId, { ...change, status: 'accepted' });
      console.log(chalk.green('✅ File edit approved! Applying changes...'));
      return { approved: true, changeId };
    } else if (response === 'reject') {
      this.pendingChanges.set(changeId, { ...change, status: 'rejected' });
      console.log(chalk.red('❌ File edit rejected.'));
      return { approved: false, changeId };
    } else if (response === 'preview') {
      return await this.showFullPreview(changeId);
    } else {
      this.pendingChanges.set(changeId, { ...change, status: 'cancelled' });
      console.log(chalk.yellow('⏸️ File edit cancelled.'));
      return { approved: false, changeId };
    }
  }

  async showFullPreview(changeId) {
    const change = this.pendingChanges.get(changeId);
    if (!change) return { approved: false, changeId };

    console.log(chalk.cyan('\n📋 FULL FILE PREVIEW'));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white('📁 File: ') + chalk.yellow(change.filePath));
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    const lines = change.changes.split('\n');
    lines.forEach((line, index) => {
      const lineNum = (index + 1).toString().padStart(4);
      console.log(chalk.gray(`${lineNum} │ `) + chalk.white(line));
    });
    
    console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    
    const response = await this.askPermission();
    
    if (response === 'accept') {
      this.pendingChanges.set(changeId, { ...change, status: 'accepted' });
      console.log(chalk.green('✅ File edit approved! Applying changes...'));
      return { approved: true, changeId };
    } else {
      this.pendingChanges.set(changeId, { ...change, status: 'rejected' });
      console.log(chalk.red('❌ File edit rejected.'));
      return { approved: false, changeId };
    }
  }

  async askPermission() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      console.log(chalk.yellow('\n🤔 What would you like to do?'));
      console.log(chalk.white('  [A]ccept - Apply the changes'));
      console.log(chalk.white('  [R]eject - Reject the changes'));
      console.log(chalk.white('  [P]review - Show full file preview'));
      console.log(chalk.white('  [C]ancel - Cancel the operation'));
      console.log(chalk.gray('  Choose: '));
      
      rl.question('', (answer) => {
        rl.close();
        const choice = answer.toLowerCase().trim();
        
        if (choice === 'a' || choice === 'accept') {
          resolve('accept');
        } else if (choice === 'r' || choice === 'reject') {
          resolve('reject');
        } else if (choice === 'p' || choice === 'preview') {
          resolve('preview');
        } else if (choice === 'c' || choice === 'cancel') {
          resolve('cancel');
        } else {
          console.log(chalk.red('Invalid choice. Please try again.'));
          resolve(this.askPermission());
        }
      });
    });
  }

  previewContent(content, maxLines = 10) {
    const lines = content.split('\n');
    if (lines.length <= maxLines) {
      return lines;
    }
    
    const preview = lines.slice(0, maxLines);
    preview.push(`... (${lines.length - maxLines} more lines)`);
    return preview;
  }

  getChangeStatus(changeId) {
    const change = this.pendingChanges.get(changeId);
    return change ? change.status : 'not_found';
  }

  getPendingChanges() {
    return Array.from(this.pendingChanges.entries()).map(([id, change]) => ({
      id,
      ...change
    }));
  }

  clearChange(changeId) {
    this.pendingChanges.delete(changeId);
  }

  clearAllChanges() {
    this.pendingChanges.clear();
  }
}
