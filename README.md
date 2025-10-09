# 🤖 AI Terminal CLI

**AI Terminal CLI** is a command-line interface that brings OpenAI’s power directly into your terminal.  
It allows you to chat with AI, process text files, edit code, and automate tasks — all from your command line.

---

## 🚀 Features

- 💬 Chat directly with OpenAI inside your terminal  
- 🧠 Maintain conversation context between commands  
- 📝 Read, write, and edit local files using AI  
- 🧩 Plugin-ready design (Git, Browser, Formatter, etc.)  
- ⚙️ Environment-configurable (OpenAI Key, Model, etc.)  
- 📜 Simple and extensible architecture

---

## 🏗️ Folder Structure

ai-terminal-cli/
│
├─ bin/ # CLI entry point (main command)
│ └─ ai-terminal.js
│
├─ src/
│ ├─ cli/ # CLI prompt, command handlers
│ ├─ core/ # AI processing, context management
│ ├─ config/ # Environment and settings
│ ├─ plugins/ # Optional extensions
│ └─ utils/ # Shared helpers
│
├─ data/ # Context memory and logs
├─ tests/ # Unit and integration tests
├─ .env.example # Environment variable template
├─ package.json
├─ README.md
└─ LICENSE


---

## ⚙️ Setup

### 1️⃣ Clone the project
```bash
git clone https://github.com/mdabdulkyum1/ai-terminal-cli.git
cd ai-terminal-cli

2️⃣ Install dependencies
npm install

3️⃣ Add your OpenAI API Key

Create a .env file in the root directory:

OPENAI_API_KEY=your_api_key_here

🧩 Usage

Run the CLI using Node:

node bin/ai-terminal.js


Or make it global (optional):

npm link
ai


Then use directly:

ai ask "Summarize this code"
ai edit myFile.js
ai explain "What is async/await?"

🧠 Future Plans

🔌 Plugin system (Git, File Search, Browser)

💾 Persistent memory

🧰 Multi-model support (Claude, Gemini, etc.)

🧑‍💻 Code assistant mode

🌐 API integration for web tasks

👨‍💻 Author

Md Abdul Kyum
Full-stack Developer | AI Enthusiast
📧 kyummdabdul@gmail.com

🌐 Portfolio
 | GitHub