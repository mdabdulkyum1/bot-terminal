// Bot Terminal Desktop App - Renderer Process

class BotTerminalDesktop {
    constructor() {
        this.currentTab = 'terminal';
        this.isTerminalRunning = false;
        this.terminalProcess = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProjectInfo();
        this.loadAIInfo();
        this.setupTabs();
        this.setupTerminal();
    }

    setupEventListeners() {
        // Terminal controls
        document.getElementById('startTerminalBtn').addEventListener('click', () => this.startTerminal());
        document.getElementById('stopTerminalBtn').addEventListener('click', () => this.stopTerminal());
        document.getElementById('clearTerminalBtn').addEventListener('click', () => this.clearTerminal());
        
        // Terminal input
        document.getElementById('terminalInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendTerminalCommand();
            }
        });

        // Quick actions
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeProject());
        document.getElementById('summaryBtn').addEventListener('click', () => this.showProjectSummary());
        document.getElementById('openFileBtn').addEventListener('click', () => this.openFile());
        document.getElementById('openFolderBtn').addEventListener('click', () => this.openFolder());

        // AI Chat
        document.getElementById('sendAiMessageBtn').addEventListener('click', () => this.sendAiMessage());
        document.getElementById('aiChatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAiMessage();
            }
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.hideSettings());
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.hideSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());

        // Files
        document.getElementById('refreshFilesBtn').addEventListener('click', () => this.refreshFiles());
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.panel-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;
    }

    setupTerminal() {
        this.addTerminalOutput('Welcome to Bot Terminal Desktop App!');
        this.addTerminalOutput('Type "help" for available commands.');
        this.addTerminalOutput('');
    }

    async startTerminal() {
        try {
            const result = await window.electronAPI.invoke('start-bot-terminal');
            if (result.success) {
                this.isTerminalRunning = true;
                this.updateStatus('Running', '#4caf50');
                this.addTerminalOutput('✅ Bot Terminal started successfully!');
                document.getElementById('startTerminalBtn').textContent = 'Restart Terminal';
            } else {
                this.addTerminalOutput(`❌ Failed to start terminal: ${result.error}`);
            }
        } catch (error) {
            this.addTerminalOutput(`❌ Error starting terminal: ${error.message}`);
        }
    }

    async stopTerminal() {
        try {
            const result = await window.electronAPI.invoke('stop-bot-terminal');
            if (result.success) {
                this.isTerminalRunning = false;
                this.updateStatus('Stopped', '#f44336');
                this.addTerminalOutput('🛑 Bot Terminal stopped.');
                document.getElementById('startTerminalBtn').textContent = 'Start Terminal';
            }
        } catch (error) {
            this.addTerminalOutput(`❌ Error stopping terminal: ${error.message}`);
        }
    }

    clearTerminal() {
        document.getElementById('terminalOutput').innerHTML = `
            <div class="terminal-line">
                <span class="terminal-prompt">[Ready] Bot Terminal ❯</span>
                <span class="terminal-cursor">_</span>
            </div>
        `;
    }

    sendTerminalCommand() {
        const input = document.getElementById('terminalInput');
        const command = input.value.trim();
        
        if (command) {
            this.addTerminalOutput(`$ ${command}`);
            input.value = '';
            
            // Handle special commands
            if (command === 'help') {
                this.showHelp();
            } else if (command === 'clear') {
                this.clearTerminal();
            } else if (command.startsWith('ai ')) {
                this.handleAICommand(command);
            } else {
                this.addTerminalOutput(`Executing: ${command}`);
            }
        }
    }

    addTerminalOutput(text) {
        const output = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-output-text">${text}</span>`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    showHelp() {
        const helpText = [
            'Available commands:',
            '  help              - Show this help',
            '  clear             - Clear terminal',
            '  ai <question>     - Ask AI a question',
            '  analyze           - Analyze project',
            '  summary           - Show project summary',
            '  files             - Show project files',
            ''
        ];
        
        helpText.forEach(line => this.addTerminalOutput(line));
    }

    handleAICommand(command) {
        this.addTerminalOutput('🤖 Processing AI request...');
        
        // Simulate AI response
        setTimeout(() => {
            this.addTerminalOutput('AI: I understand you want help with that. This is a demo response.');
            this.addTerminalOutput('In the full version, this would connect to your AI provider.');
        }, 1000);
    }

    async loadProjectInfo() {
        try {
            const info = await window.electronAPI.invoke('get-project-info');
            if (info.error) {
                document.getElementById('projectInfo').innerHTML = `
                    <div class="project-name">Error loading project</div>
                    <div class="project-path">${info.error}</div>
                `;
            } else {
                document.getElementById('projectInfo').innerHTML = `
                    <div class="project-name">${info.name}</div>
                    <div class="project-path">${info.path}</div>
                `;
                document.getElementById('sessionId').textContent = 'demo-session-001';
            }
        } catch (error) {
            document.getElementById('projectInfo').innerHTML = `
                <div class="project-name">Demo Project</div>
                <div class="project-path">/demo/path</div>
            `;
        }
    }

    loadAIInfo() {
        // Simulate loading AI info
        document.getElementById('aiInfo').innerHTML = `
            <div class="ai-provider">Gemini (Google)</div>
            <div class="ai-model">gemini-1.5-flash</div>
        `;
        document.getElementById('footerAiProvider').textContent = 'Gemini';
    }

    updateStatus(text, color) {
        document.getElementById('statusText').textContent = text;
        document.getElementById('statusDot').style.background = color;
    }

    async analyzeProject() {
        this.switchTab('analysis');
        document.getElementById('analysisContent').innerHTML = `
            <div class="analysis-placeholder">
                <h3>🔍 Project Analysis</h3>
                <p>Running comprehensive project analysis...</p>
                <p>This would analyze your entire codebase, identify technologies, and provide insights.</p>
                <div style="margin-top: 20px;">
                    <h4>Demo Results:</h4>
                    <ul style="text-align: left; margin: 10px 0;">
                        <li>📁 25 files analyzed</li>
                        <li>📊 1,247 lines of code</li>
                        <li>🔧 Technologies: Node.js, Electron, JavaScript</li>
                        <li>⚡ Performance: Good</li>
                        <li>🛡️ Security: No major issues found</li>
                    </ul>
                </div>
            </div>
        `;
    }

    showProjectSummary() {
        this.switchTab('analysis');
        document.getElementById('analysisContent').innerHTML = `
            <div class="analysis-placeholder">
                <h3>📊 Project Summary</h3>
                <p>This is a demo project summary. In the full version, this would show:</p>
                <ul style="text-align: left; margin: 20px 0;">
                    <li>Project structure and architecture</li>
                    <li>Technology stack analysis</li>
                    <li>Code quality metrics</li>
                    <li>Dependencies and security</li>
                    <li>AI-generated recommendations</li>
                </ul>
            </div>
        `;
    }

    async openFile() {
        try {
            const result = await window.electronAPI.invoke('open-file-dialog');
            if (result.success) {
                this.addTerminalOutput(`📁 Opened file: ${result.filePath}`);
            }
        } catch (error) {
            this.addTerminalOutput(`❌ Error opening file: ${error.message}`);
        }
    }

    async openFolder() {
        try {
            const result = await window.electronAPI.invoke('open-folder-dialog');
            if (result.success) {
                this.addTerminalOutput(`📁 Opened folder: ${result.folderPath}`);
            }
        } catch (error) {
            this.addTerminalOutput(`❌ Error opening folder: ${error.message}`);
        }
    }

    sendAiMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (message) {
            // Add user message
            this.addAiMessage(message, 'user');
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                this.addAiMessage('This is a demo AI response. In the full version, this would connect to your AI provider and provide intelligent assistance with your project.', 'ai');
            }, 1000);
        }
    }

    addAiMessage(content, sender) {
        const messages = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="ai-content" style="margin-left: auto; background: #007acc;">
                    <p>${content}</p>
                </div>
                <div class="ai-avatar" style="background: #4caf50;">👤</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-content">
                    <p>${content}</p>
                </div>
            `;
        }
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    refreshFiles() {
        // Simulate file refresh
        document.getElementById('filesTree').innerHTML = `
            <div class="file-item">
                <span class="file-icon">📁</span>
                <span class="file-name">src/</span>
            </div>
            <div class="file-item">
                <span class="file-icon">📁</span>
                <span class="file-name">public/</span>
            </div>
            <div class="file-item">
                <span class="file-icon">📄</span>
                <span class="file-name">package.json</span>
            </div>
            <div class="file-item">
                <span class="file-icon">📄</span>
                <span class="file-name">README.md</span>
            </div>
            <div class="file-item">
                <span class="file-icon">📄</span>
                <span class="file-name">.env</span>
            </div>
        `;
    }

    showSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }

    hideSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettings() {
        const aiProvider = document.getElementById('aiProviderSelect').value;
        const theme = document.getElementById('themeSelect').value;
        const fontSize = document.getElementById('terminalFontSize').value;
        
        // Save settings (in real app, this would persist)
        console.log('Settings saved:', { aiProvider, theme, fontSize });
        
        this.hideSettings();
        this.addTerminalOutput('✅ Settings saved successfully!');
    }
}

// Initialize the desktop app
document.addEventListener('DOMContentLoaded', () => {
    new BotTerminalDesktop();
});

// Mock electron API for demo
if (typeof window.electronAPI === 'undefined') {
    window.electronAPI = {
        invoke: async (channel, ...args) => {
            // Mock responses for demo
            switch (channel) {
                case 'start-bot-terminal':
                    return { success: true, pid: 12345 };
                case 'stop-bot-terminal':
                    return { success: true };
                case 'get-project-info':
                    return {
                        name: 'Bot Terminal Project',
                        path: process.cwd(),
                        type: 'Node.js',
                        files: 25,
                        lines: 1247
                    };
                case 'open-file-dialog':
                    return { success: true, filePath: '/demo/file.js' };
                case 'open-folder-dialog':
                    return { success: true, folderPath: '/demo/project' };
                default:
                    return { success: false, error: 'Mock response' };
            }
        }
    };
}
