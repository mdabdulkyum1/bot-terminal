# 🤖 BOT TERMINAL - AI Development Assistant

**Bot Terminal** is a complete AI-powered development assistant that combines the best of Cursor AI, Warp Terminal, and desktop applications into one powerful tool.

## 🎯 Your Vision Realized

✅ **Full Project Understanding** - AI can read and analyze your entire codebase  
✅ **Smart File Editing** - AI edits files with your permission and approval  
✅ **Multi-AI Support** - Gemini (current) + OpenAI (ready)  
✅ **Permission System** - AI asks permission before making changes  
✅ **Project Analysis** - Complete codebase analysis and summaries  
✅ **Desktop App Ready** - Electron app for Windows .exe installation  

## ✨ Key Features

### 🤖 AI-Powered Development
- **Full Project Analysis**: AI understands your entire codebase
- **Smart File Editing**: AI can edit any file with permission system
- **Context-Aware**: Maintains conversation history and project context
- **Multi-Provider**: Gemini API (current) + OpenAI support (ready)

### 📊 Project Intelligence
- **Code Statistics**: Lines of code, file types, project structure
- **Technology Detection**: Automatically identifies frameworks and libraries
- **Smart Summaries**: AI-generated project overviews and insights
- **File Management**: Read, edit, and analyze any file in your project

### 🔐 Permission & Safety
- **Approval System**: AI asks permission before editing files
- **Preview Changes**: See exactly what AI wants to change
- **Diff Display**: Visual comparison of current vs proposed changes
- **File Type Protection**: Only allows editing of safe file types

### 🎨 Modern Terminal Experience
- **Block-Based Execution**: Commands run in visual blocks (like Warp)
- **Beautiful UI**: Colorized output with status indicators
- **Smart Autocomplete**: Intelligent command and file completion
- **Session Management**: Persistent command history and statistics

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
# AI_PROVIDER=gemini  # or 'openai'
# GEMINI_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here (for future use)
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Start Bot Terminal
npm run bot
# or
npm start

# Or as global command (after npm link)
bot
```

## 📚 Commands Reference

### 🤖 AI Commands
```bash
ai <question>           # Ask AI any question
?<question>             # Quick AI question (shortcut)
ask <question>          # Explicit ask command
explain <topic>         # Get detailed explanations
```

### 📁 Project Commands
```bash
analyze                 # Full project analysis with AI
summary                 # Quick project overview
read <file>             # Read and display any file
edit <file>             # AI-assisted file editing (with permission)
project <query>         # Ask AI about your project
```

### 🔧 Special Commands
```bash
!help                   # Show help
!ai-info                # Show AI provider information
!project-info           # Show project analysis
!stats                  # Show session statistics
!session                # Show current session
!history                # Show command history
!clear                  # Clear terminal
```

### ⚙️ System Commands
```bash
# All normal terminal commands work:
ls, cd, git, npm, node, python, etc.
```

## 🎯 Example Usage

### Project Analysis
```bash
# Analyze your entire project
analyze

# Get quick summary
summary

# Ask about your project
project What technologies am I using?
project How is my code structured?
project Any potential issues?
```

### File Operations
```bash
# Read any file
read src/App.js
read package.json

# AI-assisted editing (with permission)
edit src/App.js
edit package.json
```

### AI Assistance
```bash
# General questions
ai How do I optimize React performance?
?What is async/await in JavaScript?
explain Docker containers

# Project-specific questions
ai How can I improve this codebase?
project What are the main components?
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# AI Provider (gemini or openai)
AI_PROVIDER=gemini

# Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# OpenAI Configuration (for future use)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=4000

# File Settings
MAX_FILE_SIZE=1000000
ALLOWED_FILE_EXTENSIONS=.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.h,.json,.md,.txt,.css,.html,.xml,.yaml,.yml
```

### File Type Safety
The terminal only allows editing of safe file types:
- **Code Files**: `.js`, `.ts`, `.jsx`, `.tsx`, `.py`, `.java`, `.cpp`, `.c`, `.h`
- **Config Files**: `.json`, `.yaml`, `.yml`, `.xml`
- **Documentation**: `.md`, `.txt`
- **Styles**: `.css`, `.html`

## 🖥️ Desktop App (Coming Soon)

The desktop app will provide:
- **Windows .exe installer** for easy installation
- **GUI interface** alongside terminal
- **File tree navigation** with AI analysis
- **Visual diff viewer** for file changes
- **Project dashboard** with statistics

## 🏗️ Architecture

```
src/bot-terminal/
├── index.js              # Main terminal class
├── main.js               # Entry point
├── botUI.js              # Beautiful UI components
├── commandBlock.js       # Command block management
├── autoComplete.js       # Smart autocomplete
├── sessionManager.js     # Session persistence
└── ...

src/core/
├── aiProvider.js         # Multi-AI support (Gemini + OpenAI)
├── projectAnalyzer.js    # Full project analysis
├── permissionManager.js  # File edit permission system
├── contextManager.js     # Conversation context
└── fileHandler.js        # File operations
```

## 🔒 Security Features

- **File Type Validation**: Only safe file extensions allowed
- **Size Limits**: Maximum file size protection
- **Permission System**: User approval required for all edits
- **Preview Mode**: See changes before applying
- **Session Isolation**: Commands run in controlled environment

## 📊 Session Analytics

Track your development workflow:
- **Command Statistics**: Success rates, timing, error tracking
- **AI vs System Commands**: Usage patterns and efficiency
- **Project Metrics**: File analysis, code statistics
- **Session History**: Persistent command and result storage

## 🚀 Advanced Features

### Smart Autocomplete
- **Command Completion**: AI, project, and system commands
- **File Path Completion**: Navigate with tab completion
- **Context Suggestions**: Smart recommendations based on history

### Project Intelligence
- **Automatic Analysis**: Scans entire codebase on startup
- **Technology Detection**: Identifies frameworks and tools
- **Code Statistics**: Lines, files, complexity metrics
- **AI Insights**: Intelligent project recommendations

### Multi-AI Support
- **Gemini Integration**: Current default provider
- **OpenAI Ready**: Easy switching to GPT models
- **Provider Comparison**: Test different AI models
- **Fallback System**: Automatic provider switching

## 🎯 Use Cases

### Development Workflow
1. **Project Analysis**: `analyze` - Understand your codebase
2. **File Exploration**: `read src/App.js` - Examine specific files
3. **AI Assistance**: `ai How can I optimize this?` - Get AI help
4. **Smart Editing**: `edit src/App.js` - AI-assisted improvements
5. **Project Questions**: `project What should I focus on?` - Strategic insights

### Learning & Documentation
- **Code Explanation**: `explain async/await` - Learn concepts
- **Best Practices**: `ai React best practices` - Get expert advice
- **Architecture Questions**: `project How is this structured?` - Understand design

### Maintenance & Debugging
- **Issue Analysis**: `project Any potential bugs?` - Find problems
- **Performance**: `ai How to optimize this code?` - Get optimization tips
- **Refactoring**: `edit src/components/Button.js` - AI-assisted improvements

## 🔮 Future Enhancements

- [ ] **Desktop GUI**: Visual interface with file tree
- [ ] **Plugin System**: Custom commands and integrations
- [ ] **Team Collaboration**: Shared sessions and insights
- [ ] **Code Generation**: AI-powered code creation
- [ ] **Testing Integration**: Automated test suggestions
- [ ] **Git Integration**: Smart commit messages and branch management

---

**Your AI development assistant is ready!** 🎉

Start with `npm run bot` and experience the future of development with AI-powered assistance that understands your entire project and helps you build better software.

## 🆘 Support

- **Issues**: Report bugs or request features
- **Documentation**: Check command help with `!help`
- **AI Help**: Get AI command reference with `!ai-help`
- **Project Info**: See analysis with `!project-info`

**Happy coding with AI!** 🚀🤖
