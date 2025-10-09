# 🤖 WARP AI TERMINAL

A modern, AI-powered terminal experience inspired by Warp Terminal, built specifically for your development workflow.

## ✨ Features

### 🎨 Modern UI
- Beautiful ASCII art welcome screen
- Block-based command execution (like Warp)
- Colorized output with status indicators
- Real-time command processing feedback

### 🤖 AI Integration
- **Direct AI Commands**: `ai <question>` or `?<question>`
- **Smart Context**: Maintains conversation history
- **AI-Assisted Editing**: `edit <file>` for AI-powered code improvements
- **Explanations**: `explain <topic>` for detailed explanations

### 📊 Session Management
- **Persistent Sessions**: Commands saved automatically
- **Session Statistics**: Track usage, success rates, and timing
- **Command History**: Full history with smart autocomplete
- **Block Organization**: Each command is a separate, trackable block

### 🔧 Smart Features
- **AutoComplete**: Intelligent command and file completion
- **Git Integration**: Smart git command suggestions
- **NPM Integration**: Package manager command completion
- **File Path Completion**: Navigate with tab completion

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run the Warp Terminal
```bash
# Using npm script
npm run warp

# Or directly
node src/warp-terminal/main.js

# Or as global command (after npm link)
warp
```

## 📚 Commands

### Special Commands (prefixed with `!`)
- `!help` - Show help message
- `!history` - Show command history
- `!clear` - Clear the terminal screen
- `!session` - Show current session blocks
- `!stats` - Show session statistics
- `!sessions` - List all saved sessions
- `!ai-help` - Show AI command help

### AI Commands
- `ai <question>` - Ask AI any question
- `?<question>` - Quick AI question (shortcut)
- `ask <question>` - Explicit ask command
- `explain <topic>` - Get detailed explanation
- `edit <file>` - AI-assisted file editing

### Regular Commands
All standard terminal commands work normally:
- `ls`, `cd`, `pwd`, `mkdir`, etc.
- `git` commands with smart completion
- `npm` commands with suggestions
- Any system command

## 🎯 Examples

```bash
# AI Commands
ai How do I optimize React performance?
?What is the difference between let and const?
explain Docker containers
edit src/components/App.js

# System Commands (with smart completion)
git add .
npm install express
ls -la
cd projects/my-app

# Special Commands
!stats
!session
!history
```

## 🏗️ Architecture

```
src/warp-terminal/
├── index.js          # Main terminal class
├── main.js           # Entry point
├── warpUI.js         # Beautiful UI components
├── commandBlock.js   # Command block management
├── autoComplete.js   # Smart autocomplete
└── sessionManager.js # Session persistence
```

## 🔧 Configuration

The terminal uses your existing `.env` configuration:
```env
GEMINI_API_KEY=your_api_key_here
MODEL=gemini-1.5-flash
```

## 💾 Data Storage

Sessions are automatically saved to:
- `data/sessions/` - Individual session files
- `data/memory.json` - AI conversation context
- `data/logs/` - Application logs

## 🎨 UI Features

### Command Blocks
Each command runs in a visually distinct block with:
- Input command display
- Real-time processing indicators
- Success/error status
- Execution time tracking
- Output formatting

### Status Indicators
- 🔄 Processing
- ⚙️ Executing
- ✓ Completed
- ❌ Error
- 🤖 AI Response

### Color Coding
- **Blue**: Information and prompts
- **Green**: Success and AI responses
- **Red**: Errors and warnings
- **Yellow**: Warnings and system commands
- **Cyan**: Headers and special output
- **Gray**: Secondary information

## 🚀 Advanced Features

### Smart Autocomplete
- Command completion
- File path completion
- Git command suggestions
- NPM command suggestions
- AI command templates

### Session Analytics
- Command success rates
- AI vs system command usage
- Average execution times
- Error tracking
- Session persistence

## 🔮 Future Enhancements

- [ ] Plugin system for custom commands
- [ ] Theme customization
- [ ] Multi-workspace support
- [ ] Command sharing between sessions
- [ ] Advanced AI context management
- [ ] Integration with popular dev tools

---

**Enjoy your new AI-powered terminal experience!** 🎉
