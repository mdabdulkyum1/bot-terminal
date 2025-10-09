#!/usr/bin/env node

// Demo script to showcase Warp Terminal features
import chalk from 'chalk';

console.log(chalk.cyan('🚀 WARP AI TERMINAL DEMO'));
console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

console.log(chalk.yellow('🎯 Key Features:'));
console.log(chalk.white('• Block-based command execution (like Warp)'));
console.log(chalk.white('• AI-powered assistance with Gemini API'));
console.log(chalk.white('• Smart autocomplete and suggestions'));
console.log(chalk.white('• Persistent session management'));
console.log(chalk.white('• Beautiful terminal UI with colors'));
console.log(chalk.white('• Command history and statistics'));

console.log(chalk.yellow('\n🤖 AI Commands:'));
console.log(chalk.white('  ai <question>     - Ask AI any question'));
console.log(chalk.white('  ?<question>       - Quick AI question'));
console.log(chalk.white('  explain <topic>   - Get detailed explanations'));
console.log(chalk.white('  edit <file>       - AI-assisted file editing'));

console.log(chalk.yellow('\n🔧 Special Commands:'));
console.log(chalk.white('  !help        - Show help'));
console.log(chalk.white('  !stats       - Show session statistics'));
console.log(chalk.white('  !session     - Show current session'));
console.log(chalk.white('  !history     - Show command history'));

console.log(chalk.yellow('\n📝 Examples:'));
console.log(chalk.gray('  ai How do I use git?'));
console.log(chalk.gray('  ?What is async/await?'));
console.log(chalk.gray('  explain Docker containers'));
console.log(chalk.gray('  edit src/main.js'));
console.log(chalk.gray('  ls -la'));
console.log(chalk.gray('  git status'));

console.log(chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green('🚀 Ready to start? Run: npm run warp'));
console.log(chalk.blue('📚 For more info, see: WARP_TERMINAL.md\n'));
